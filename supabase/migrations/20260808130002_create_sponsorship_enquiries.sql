create table public.sponsorship_enquiries (
  id         uuid primary key default gen_random_uuid(),
  company    text not null,
  name       text not null,
  email      text not null,
  message    text not null,
  status     text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

alter table public.sponsorship_enquiries enable row level security;

create policy "public can submit sponsorship_enquiries" on public.sponsorship_enquiries
  for insert to anon, authenticated with check (true);

create policy "admin can read sponsorship_enquiries" on public.sponsorship_enquiries
  for select using (public.is_admin());

create policy "admin can update sponsorship_enquiries" on public.sponsorship_enquiries
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete sponsorship_enquiries" on public.sponsorship_enquiries
  for delete using (public.is_admin());
