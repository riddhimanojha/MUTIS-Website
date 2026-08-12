create table public.articles (
  id              uuid primary key default gen_random_uuid(),
  tag             text not null,
  title           text not null,
  author_id       uuid references auth.users(id) on delete set null,
  author_name     text not null,
  cover_image_url text,
  body_markdown   text,
  pdf_url         text,
  status          text not null default 'draft' check (status in ('draft','published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (body_markdown is not null or pdf_url is not null)
);

alter table public.articles enable row level security;

create policy "public read published articles" on public.articles
  for select using (status = 'published');

create policy "admin read all articles" on public.articles
  for select using (public.is_admin());

create policy "admin write articles" on public.articles
  for all using (public.is_admin()) with check (public.is_admin());
