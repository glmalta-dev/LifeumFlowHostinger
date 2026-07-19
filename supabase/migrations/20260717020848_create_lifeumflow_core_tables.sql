create extension if not exists pgcrypto;

create table if not exists public.patients (
  id text primary key default gen_random_uuid()::text,
  name text not null check (length(trim(name)) > 0),
  birth_date date not null,
  cpf text,
  phone text not null,
  email text not null default '',
  status text not null check (status in ('active','alert','inactive')),
  next_action text,
  next_action_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id text primary key default gen_random_uuid()::text,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  date date not null,
  time time not null,
  type text not null check (type in ('consulta','retorno','cirurgia','planejamento','manutencao')),
  status text not null check (status in ('agendado','confirmado','realizado','cancelado')),
  professional text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key default gen_random_uuid()::text,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  title text not null,
  description text not null default '',
  due_date date not null,
  status text not null check (status in ('pending','completed')),
  priority text not null check (priority in ('high','medium','low')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evolutions (
  id text primary key default gen_random_uuid()::text,
  patient_id text not null references public.patients(id) on delete cascade,
  date date not null,
  professional text not null,
  procedure text not null,
  description text not null,
  next_step text,
  recommended_return_days integer check (recommended_return_days is null or recommended_return_days >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.files (
  id text primary key default gen_random_uuid()::text,
  patient_id text not null references public.patients(id) on delete cascade,
  name text not null,
  upload_date date not null,
  size text not null,
  mime_type text not null,
  download_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  phone text not null,
  source text not null,
  status text not null check (status in ('novo','contatado','agendado','arquivado')),
  last_contact_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flows (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  stages jsonb not null default '[]'::jsonb check (jsonb_typeof(stages) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_patient_date_idx on public.appointments (patient_id, date, time);
create index if not exists appointments_status_date_idx on public.appointments (status, date);
create index if not exists tasks_patient_status_due_idx on public.tasks (patient_id, status, due_date);
create index if not exists tasks_status_due_idx on public.tasks (status, due_date);
create index if not exists evolutions_patient_date_idx on public.evolutions (patient_id, date desc);
create index if not exists files_patient_upload_idx on public.files (patient_id, upload_date desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.tasks enable row level security;
alter table public.evolutions enable row level security;
alter table public.files enable row level security;
alter table public.leads enable row level security;
alter table public.flows enable row level security;

revoke all on table public.patients, public.appointments, public.tasks, public.evolutions, public.files, public.leads, public.flows from anon;
grant select, insert, update, delete on table public.patients, public.appointments, public.tasks, public.evolutions, public.files, public.leads, public.flows to authenticated;
grant all on table public.patients, public.appointments, public.tasks, public.evolutions, public.files, public.leads, public.flows to service_role;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['patients','appointments','tasks','evolutions','files','leads','flows']
  loop
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_select', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_insert', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_update', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_delete', table_name);
    execute format('create policy %I on public.%I for select to authenticated using (true)', table_name || '_authenticated_select', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (true)', table_name || '_authenticated_insert', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (true) with check (true)', table_name || '_authenticated_update', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (true)', table_name || '_authenticated_delete', table_name);
  end loop;
end $$;
