create table public.committee_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text not null,
  headshot_url  text,
  linkedin_url  text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.committee_members enable row level security;

create policy "public read active committee_members" on public.committee_members
  for select using (is_active = true);

create policy "admin read all committee_members" on public.committee_members
  for select using (public.is_admin());

create policy "admin write committee_members" on public.committee_members
  for all using (public.is_admin()) with check (public.is_admin());
