alter table public.events add column tags text[] not null default '{}';
