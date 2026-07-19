-- Lifeum Flow: complementos aprovados do MVP.
-- Mantem decisoes ainda abertas na documentacao fora do schema (retencao,
-- assinatura, politica final de MIME/tamanho e regra de duplicidade de CPF).

create table if not exists public.clinic_settings (
  clinic_id uuid primary key references public.clinics(id) on delete cascade,
  administrative_phone text,
  business_hours jsonb not null default '{}'::jsonb check (jsonb_typeof(business_hours) = 'object'),
  resources jsonb not null default '[]'::jsonb check (jsonb_typeof(resources) = 'array'),
  preferences jsonb not null default '{}'::jsonb check (jsonb_typeof(preferences) = 'object'),
  inactivity_days integer not null default 30 check (inactivity_days between 1 and 3650),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);

create table if not exists public.contact_events (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id text references public.patients(id) on delete cascade,
  lead_id text references public.leads(id) on delete cascade,
  channel text not null check (channel in ('whatsapp','phone','email','other')),
  outcome text not null check (length(trim(outcome)) > 0),
  notes text,
  contacted_at timestamptz not null default now(),
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  constraint contact_events_subject_check check (num_nonnulls(patient_id, lead_id) = 1)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  actor_id uuid default auth.uid(),
  action text not null check (action in ('INSERT','UPDATE','DELETE')),
  entity_type text not null,
  entity_id text not null,
  changed_fields text[] not null default '{}'::text[],
  correlation_id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.clinic_settings enable row level security;
alter table public.contact_events enable row level security;
alter table public.audit_logs enable row level security;

create policy clinic_settings_tenant_select on public.clinic_settings
  for select to authenticated
  using ((select private.is_clinic_member(clinic_settings.clinic_id)));
create policy clinic_settings_tenant_insert on public.clinic_settings
  for insert to authenticated
  with check ((select private.is_clinic_member(clinic_settings.clinic_id, array['owner','admin'])));
create policy clinic_settings_tenant_update on public.clinic_settings
  for update to authenticated
  using ((select private.is_clinic_member(clinic_settings.clinic_id, array['owner','admin'])))
  with check ((select private.is_clinic_member(clinic_settings.clinic_id, array['owner','admin'])));

create policy contact_events_tenant_select on public.contact_events
  for select to authenticated
  using ((select private.is_clinic_member(contact_events.clinic_id)));
create policy contact_events_tenant_insert on public.contact_events
  for insert to authenticated
  with check ((select private.is_clinic_member(contact_events.clinic_id, array['owner','admin','dentist','reception'])));
create policy contact_events_tenant_update on public.contact_events
  for update to authenticated
  using ((select private.is_clinic_member(contact_events.clinic_id, array['owner','admin','dentist','reception'])))
  with check ((select private.is_clinic_member(contact_events.clinic_id, array['owner','admin','dentist','reception'])));
create policy contact_events_tenant_delete on public.contact_events
  for delete to authenticated
  using ((select private.is_clinic_member(contact_events.clinic_id, array['owner','admin'])));

create policy audit_logs_tenant_select on public.audit_logs
  for select to authenticated
  using ((select private.is_clinic_member(audit_logs.clinic_id, array['owner','admin'])));

grant select, insert, update on public.clinic_settings to authenticated;
grant select, insert, update, delete on public.contact_events to authenticated;
grant select on public.audit_logs to authenticated;
revoke insert, update, delete on public.audit_logs from authenticated;

create index if not exists contact_events_clinic_patient_date_idx
  on public.contact_events (clinic_id, patient_id, contacted_at desc);
create index if not exists contact_events_clinic_lead_date_idx
  on public.contact_events (clinic_id, lead_id, contacted_at desc);
create index if not exists audit_logs_clinic_entity_date_idx
  on public.audit_logs (clinic_id, entity_type, entity_id, created_at desc);

-- Concorrencia otimista e autoria operacional.
do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'patients','appointments','tasks','evolutions','files','leads','flows',
    'patient_planners','message_templates','plan_workflows','plan_steps'
  ] loop
    execute format('alter table public.%I add column if not exists version integer not null default 1', target_table);
    execute format('alter table public.%I add column if not exists created_by uuid', target_table);
    execute format('alter table public.%I add column if not exists updated_by uuid', target_table);
  end loop;
end $$;

alter table public.appointments add column if not exists cleanup_interval integer not null default 0;
alter table public.appointments add constraint appointments_cleanup_interval_check
  check (cleanup_interval between 0 and 240) not valid;
alter table public.appointments validate constraint appointments_cleanup_interval_check;

alter table public.plan_steps drop constraint if exists plan_steps_status_check;
alter table public.plan_steps add constraint plan_steps_status_check check (
  status in ('pending','ready','in_progress','waiting','completed','skipped','cancelled')
);

create or replace function private.touch_operational_row()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := (select auth.uid());
  new.version := coalesce(old.version, 0) + 1;
  return new;
end;
$$;

revoke all on function private.touch_operational_row() from public, anon, authenticated;

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'patients','appointments','tasks','evolutions','files','leads','flows',
    'patient_planners','message_templates','plan_workflows','plan_steps'
  ] loop
    execute format('drop trigger if exists %I on public.%I', 'touch_' || target_table, target_table);
    execute format(
      'create trigger %I before update on public.%I for each row execute function private.touch_operational_row()',
      'touch_' || target_table, target_table
    );
  end loop;
end $$;

drop trigger if exists touch_clinic_settings on public.clinic_settings;
create trigger touch_clinic_settings before update on public.clinic_settings
  for each row execute function private.touch_operational_row();

-- Bloqueia sobreposicao de profissional ou recurso em horarios ativos.
create or replace function private.prevent_appointment_conflict()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_end time;
begin
  if new.status not in ('agendado','confirmado') then
    return new;
  end if;

  new_end := new.time + make_interval(mins => coalesce(new.duration, 0) + coalesce(new.cleanup_interval, 0));

  if exists (
    select 1
    from public.appointments as scheduled
    where scheduled.clinic_id = new.clinic_id
      and scheduled.date = new.date
      and scheduled.id <> new.id
      and scheduled.status in ('agendado','confirmado')
      and scheduled.time < new_end
      and (scheduled.time + make_interval(mins => coalesce(scheduled.duration, 0) + coalesce(scheduled.cleanup_interval, 0))) > new.time
      and (
        lower(trim(scheduled.professional)) = lower(trim(new.professional))
        or (
          nullif(trim(scheduled.room_or_chair), '') is not null
          and lower(trim(scheduled.room_or_chair)) = lower(trim(new.room_or_chair))
        )
      )
  ) then
    raise exception using
      errcode = '23P01',
      message = 'Conflito de agenda: profissional ou recurso ja ocupado nesse horario.';
  end if;

  return new;
end;
$$;

revoke all on function private.prevent_appointment_conflict() from public, anon, authenticated;
drop trigger if exists prevent_appointment_conflict on public.appointments;
create trigger prevent_appointment_conflict
  before insert or update of clinic_id, date, time, duration, cleanup_interval, professional, room_or_chair, status
  on public.appointments for each row execute function private.prevent_appointment_conflict();

-- Auditoria guarda apenas metadados e nomes de campos; nao duplica conteudo clinico.
create or replace function private.capture_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_before jsonb := case when tg_op = 'INSERT' then '{}'::jsonb else to_jsonb(old) end;
  row_after jsonb := case when tg_op = 'DELETE' then '{}'::jsonb else to_jsonb(new) end;
  target_clinic uuid := coalesce((row_after ->> 'clinic_id')::uuid, (row_before ->> 'clinic_id')::uuid);
  target_id text := coalesce(row_after ->> 'id', row_before ->> 'id', row_after ->> 'clinic_id', row_before ->> 'clinic_id');
  fields text[];
begin
  select coalesce(array_agg(key order by key), '{}'::text[])
    into fields
  from (
    select key from jsonb_object_keys(row_before || row_after) as key
    where row_before -> key is distinct from row_after -> key
      and key not in ('updated_at','updated_by','version')
  ) changed;

  insert into public.audit_logs (clinic_id, actor_id, action, entity_type, entity_id, changed_fields)
  values (target_clinic, (select auth.uid()), tg_op, tg_table_name, target_id, fields);

  return coalesce(new, old);
end;
$$;

revoke all on function private.capture_audit_event() from public, anon, authenticated;

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'patients','appointments','tasks','evolutions','files','leads',
    'plan_workflows','plan_steps','contact_events','clinic_settings'
  ] loop
    execute format('drop trigger if exists %I on public.%I', 'audit_' || target_table, target_table);
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function private.capture_audit_event()',
      'audit_' || target_table, target_table
    );
  end loop;
end $$;

-- Revisao atomica de evolucao: preserva o estado anterior e exige justificativa.
create or replace function public.revise_evolution(
  target_evolution_id text,
  revision_reason text,
  revised_procedure text,
  revised_description text,
  revised_complication text default null,
  revised_conduct text default null,
  revised_guidance text default null,
  revised_next_step text default null,
  revised_return_days integer default null
)
returns public.evolutions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  previous_row public.evolutions;
  current_row public.evolutions;
begin
  if length(trim(coalesce(revision_reason, ''))) < 3 then
    raise exception 'A justificativa da revisao deve ter ao menos 3 caracteres.';
  end if;

  select * into previous_row
  from public.evolutions
  where id = target_evolution_id
  for update;

  if not found then
    raise exception 'Evolucao nao encontrada.';
  end if;

  update public.evolutions
  set procedure = revised_procedure,
      description = revised_description,
      complication = revised_complication,
      conduct = revised_conduct,
      guidance = revised_guidance,
      next_step = revised_next_step,
      recommended_return_days = revised_return_days,
      change_reason = revision_reason
  where id = target_evolution_id
  returning * into current_row;

  insert into public.evolution_revisions (
    clinic_id, evolution_id, previous_data, current_data, change_reason, changed_by
  ) values (
    previous_row.clinic_id, previous_row.id, to_jsonb(previous_row), to_jsonb(current_row),
    revision_reason, (select auth.uid())
  );

  return current_row;
end;
$$;

revoke all on function public.revise_evolution(text,text,text,text,text,text,text,text,integer) from public, anon;
grant execute on function public.revise_evolution(text,text,text,text,text,text,text,text,integer) to authenticated;
