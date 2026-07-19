create or replace function public.convert_lead_to_patient(
  target_lead_id text,
  patient_payload jsonb
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  source_lead public.leads;
  created_patient_id text;
begin
  select * into source_lead
  from public.leads
  where id = target_lead_id
  for update;

  if not found then raise exception 'Lead nao encontrado.'; end if;
  if source_lead.status = 'arquivado' then raise exception 'Lead ja arquivado.'; end if;
  if nullif(patient_payload ->> 'birth_date', '') is null then
    raise exception 'Data de nascimento obrigatoria.';
  end if;

  insert into public.patients (
    clinic_id, name, birth_date, cpf, sex, phone, email, status,
    next_action, next_action_date, notes, cep, street, number, complement,
    neighborhood, city, state, created_by, updated_by
  ) values (
    source_lead.clinic_id,
    coalesce(nullif(patient_payload ->> 'name', ''), source_lead.name),
    (patient_payload ->> 'birth_date')::date,
    nullif(patient_payload ->> 'cpf', ''),
    coalesce(nullif(patient_payload ->> 'sex', ''), 'not_informed'),
    coalesce(nullif(patient_payload ->> 'phone', ''), source_lead.phone),
    coalesce(patient_payload ->> 'email', ''),
    'active', nullif(patient_payload ->> 'next_action', ''),
    nullif(patient_payload ->> 'next_action_date', '')::date,
    nullif(patient_payload ->> 'notes', ''), nullif(patient_payload ->> 'cep', ''),
    nullif(patient_payload ->> 'street', ''), nullif(patient_payload ->> 'number', ''),
    nullif(patient_payload ->> 'complement', ''), nullif(patient_payload ->> 'neighborhood', ''),
    nullif(patient_payload ->> 'city', ''), nullif(patient_payload ->> 'state', ''),
    (select auth.uid()), (select auth.uid())
  ) returning id into created_patient_id;

  update public.leads
  set status = 'arquivado', updated_by = (select auth.uid())
  where id = source_lead.id;

  insert into public.contact_events (clinic_id, lead_id, channel, outcome, notes, created_by)
  values (source_lead.clinic_id, source_lead.id, 'other', 'converted_to_patient', created_patient_id, (select auth.uid()));

  return created_patient_id;
end;
$$;

revoke all on function public.convert_lead_to_patient(text, jsonb) from public, anon;
grant execute on function public.convert_lead_to_patient(text, jsonb) to authenticated;
