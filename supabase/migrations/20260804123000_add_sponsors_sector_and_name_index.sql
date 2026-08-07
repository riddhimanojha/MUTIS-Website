alter table public.sponsors
  add column if not exists sector text;

create unique index if not exists sponsors_name_key on public.sponsors (name);