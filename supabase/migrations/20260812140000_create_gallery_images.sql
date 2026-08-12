create table public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,
  caption       text,
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

create policy "public read published gallery_images" on public.gallery_images
  for select using (is_published = true);

create policy "admin read all gallery_images" on public.gallery_images
  for select using (public.is_admin());

create policy "admin write gallery_images" on public.gallery_images
  for all using (public.is_admin()) with check (public.is_admin());
