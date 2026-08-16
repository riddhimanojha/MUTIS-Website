create table public.documents (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  category        text not null default 'general',
  team_id         text,
  storage_path    text not null,
  file_size_bytes integer,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "public read published documents" on public.documents
  for select using (is_published = true);

create policy "admin read all documents" on public.documents
  for select using (public.is_admin());

create policy "admin write documents" on public.documents
  for all using (public.is_admin()) with check (public.is_admin());
