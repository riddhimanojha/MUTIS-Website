-- Wrapper functions so the etoro-set-key / etoro-portfolio Edge Functions
-- (using the service_role key over PostgREST) can read and write the
-- eToro API credentials in Supabase Vault, without exposing the `vault`
-- schema itself to PostgREST. Only service_role may execute these — the
-- eToro key pair never reaches client code or the anon/authenticated roles.

create or replace function public.etoro_set_secret(secret_name text, secret_value text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_id uuid;
begin
  select id into existing_id from vault.secrets where name = secret_name;
  if existing_id is not null then
    perform vault.update_secret(existing_id, secret_value);
  else
    perform vault.create_secret(secret_value, secret_name);
  end if;
end;
$$;

revoke all on function public.etoro_set_secret(text, text) from public, anon, authenticated;
grant execute on function public.etoro_set_secret(text, text) to service_role;

create or replace function public.etoro_get_secret(secret_name text)
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select decrypted_secret from vault.decrypted_secrets where name = secret_name limit 1;
$$;

revoke all on function public.etoro_get_secret(text) from public, anon, authenticated;
grant execute on function public.etoro_get_secret(text) to service_role;
