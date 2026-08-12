-- service_role has RLS-bypass, but Postgres privilege checks are separate from
-- RLS: the role still needs a plain table grant. Without this, edge functions
-- using the service_role key (inviting/removing admins) fail with "permission
-- denied for table admin_users" even though RLS would never have blocked them.
grant select, insert, update, delete on public.admin_users to service_role;
