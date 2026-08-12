create table public.presidents (
  id            uuid primary key default gen_random_uuid(),
  year_label    text not null,
  start_year    integer not null,
  name          text not null,
  notes         text,
  linkedin_url  text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.presidents enable row level security;

create policy "public read published presidents" on public.presidents
  for select using (is_published = true);

create policy "admin read all presidents" on public.presidents
  for select using (public.is_admin());

create policy "admin write presidents" on public.presidents
  for all using (public.is_admin()) with check (public.is_admin());
