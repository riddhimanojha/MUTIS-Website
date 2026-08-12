create table public.podcast_settings (
  id            uuid primary key default gen_random_uuid(),
  spotify_url   text not null default '',
  embed_html    text,
  embed_width   integer,
  embed_height  integer,
  embed_title   text,
  thumbnail_url text,
  fetched_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

insert into public.podcast_settings (spotify_url) values ('');

alter table public.podcast_settings enable row level security;

create policy "public read podcast settings" on public.podcast_settings
  for select using (true);

create policy "admin write podcast settings" on public.podcast_settings
  for all using (public.is_admin()) with check (public.is_admin());
