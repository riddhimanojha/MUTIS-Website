create table public.events (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null,
  location        text not null,
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  cover_image_url text,
  capacity        integer,
  signup_enabled  boolean not null default false,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "public read published events" on public.events
  for select using (is_published = true);

create policy "admin read all events" on public.events
  for select using (public.is_admin());

create policy "admin write events" on public.events
  for all using (public.is_admin()) with check (public.is_admin());
