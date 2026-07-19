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
