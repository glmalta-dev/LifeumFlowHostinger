do $$
declare
  table_name text;
  identity_check text := '(select auth.uid()) is not null';
begin
  foreach table_name in array array['patients','appointments','tasks','evolutions','files','leads','flows']
  loop
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_select', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_insert', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_update', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated_delete', table_name);
    execute format('create policy %I on public.%I for select to authenticated using (%s)', table_name || '_authenticated_select', table_name, identity_check);
    execute format('create policy %I on public.%I for insert to authenticated with check (%s)', table_name || '_authenticated_insert', table_name, identity_check);
    execute format('create policy %I on public.%I for update to authenticated using (%s) with check (%s)', table_name || '_authenticated_update', table_name, identity_check, identity_check);
    execute format('create policy %I on public.%I for delete to authenticated using (%s)', table_name || '_authenticated_delete', table_name, identity_check);
  end loop;
end $$;
