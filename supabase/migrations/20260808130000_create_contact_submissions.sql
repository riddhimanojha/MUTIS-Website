create table public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  reason     text not null,
  message    text not null,
  status     text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "public can submit contact_submissions" on public.contact_submissions
  for insert to anon, authenticated with check (true);

create policy "admin can read contact_submissions" on public.contact_submissions
  for select using (public.is_admin());

create policy "admin can update contact_submissions" on public.contact_submissions
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete contact_submissions" on public.contact_submissions
  for delete using (public.is_admin());
