create table public.alumni (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  firm              text not null,
  role              text not null,
  cohort            text not null,
  location          text,
  linkedin_url      text,
  consent_confirmed boolean not null default false,
  is_published      boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (not is_published or consent_confirmed)
);

alter table public.alumni enable row level security;

create policy "public read published alumni" on public.alumni
  for select using (is_published = true);

create policy "admin read all alumni" on public.alumni
  for select using (public.is_admin());

create policy "admin write alumni" on public.alumni
  for all using (public.is_admin()) with check (public.is_admin());
