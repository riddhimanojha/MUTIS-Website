-- Full before/after snapshot per write, captured app-side by every admin
-- mutation (see application/app/admin/useAdminMutation.ts), not by a
-- trigger. No update/delete policy or grant exists on this table at all —
-- immutable by construction, not just convention.
create table public.audit_log (
  id             uuid primary key default gen_random_uuid(),
  actor_user_id  uuid references auth.users(id) on delete set null,
  actor_email    text not null,
  table_name     text not null,
  row_id         uuid not null,
  action         text not null check (action in ('insert', 'update', 'delete')),
  before         jsonb,
  after          jsonb,
  created_at     timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy "admin read audit_log" on public.audit_log
  for select
  using (public.is_admin());

create policy "admin write audit_log" on public.audit_log
  for insert
  with check (public.is_admin());

grant select, insert on public.audit_log to authenticated;
