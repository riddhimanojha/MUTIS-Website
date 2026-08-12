create table public.event_signups (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  name       text not null,
  email      text not null,
  notes      text,
  status     text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now(),
  unique (event_id, email)
);

alter table public.event_signups enable row level security;

create policy "public can submit event_signups" on public.event_signups
  for insert to anon, authenticated with check (true);

create policy "admin can read event_signups" on public.event_signups
  for select using (public.is_admin());

create policy "admin can update event_signups" on public.event_signups
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete event_signups" on public.event_signups
  for delete using (public.is_admin());
