create table public.home_programs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.home_programs enable row level security;

create policy "public read published home_programs" on public.home_programs
  for select using (is_published = true);

create policy "admin read all home_programs" on public.home_programs
  for select using (public.is_admin());

create policy "admin write home_programs" on public.home_programs
  for all using (public.is_admin()) with check (public.is_admin());
