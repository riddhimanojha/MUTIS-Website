create table public.fund_managers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  year_label   text not null,
  start_year   integer not null,
  linkedin_url text,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.fund_managers enable row level security;

create policy "public read published fund_managers" on public.fund_managers
  for select using (is_published = true);

create policy "admin read all fund_managers" on public.fund_managers
  for select using (public.is_admin());

create policy "admin write fund_managers" on public.fund_managers
  for all using (public.is_admin()) with check (public.is_admin());
