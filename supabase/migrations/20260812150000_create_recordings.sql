create table public.recordings (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  speaker       text,
  event_date    date not null,
  recording_url text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.recordings enable row level security;

create policy "public read published recordings" on public.recordings
  for select using (is_published = true);

create policy "admin read all recordings" on public.recordings
  for select using (public.is_admin());

create policy "admin write recordings" on public.recordings
  for all using (public.is_admin()) with check (public.is_admin());
