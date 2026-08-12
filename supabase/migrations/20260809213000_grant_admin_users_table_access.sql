-- admin_users was created out-of-band, before migration tracking started,
-- and its migration never included a table grant (unlike every other
-- table, which grants select/insert/update/delete to authenticated
-- alongside its RLS policies). Without this, RLS never even gets
-- evaluated: Postgres requires both a grant AND a passing RLS policy, so
-- every query from the authenticated role failed with permission denied
-- regardless of admin_users_read_self being correct. No update grant is
-- included since no admin_users edit flow exists (authorization is flat,
-- add/remove only).
grant select, insert, delete on public.admin_users to authenticated;
