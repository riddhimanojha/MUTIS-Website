create table public.past_speakers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  firm         text not null,
  role         text not null,
  event        text not null,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.past_speakers enable row level security;

create policy "public read published past_speakers" on public.past_speakers
  for select using (is_published = true);

create policy "admin read all past_speakers" on public.past_speakers
  for select using (public.is_admin());

create policy "admin write past_speakers" on public.past_speakers
  for all using (public.is_admin()) with check (public.is_admin());
