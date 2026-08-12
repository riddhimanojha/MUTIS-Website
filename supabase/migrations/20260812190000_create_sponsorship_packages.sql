create table public.sponsorship_packages (
  id            uuid primary key default gen_random_uuid(),
  tier          text not null,
  headline      text not null,
  deliverables  text[] not null default '{}',
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.sponsorship_packages enable row level security;

create policy "public read published sponsorship_packages" on public.sponsorship_packages
  for select using (is_published = true);

create policy "admin read all sponsorship_packages" on public.sponsorship_packages
  for select using (public.is_admin());

create policy "admin write sponsorship_packages" on public.sponsorship_packages
  for all using (public.is_admin()) with check (public.is_admin());
