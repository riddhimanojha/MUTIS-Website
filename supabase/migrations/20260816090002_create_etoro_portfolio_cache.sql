create table public.etoro_portfolio_cache (
  id             boolean primary key default true,
  account_totals jsonb,
  holdings       jsonb not null default '[]'::jsonb,
  sync_status    text not null default 'pending',
  sync_error     text,
  fetched_at     timestamptz,
  constraint etoro_portfolio_cache_singleton check (id),
  constraint etoro_portfolio_cache_sync_status_check check (sync_status in ('pending', 'ok', 'error'))
);

insert into public.etoro_portfolio_cache (id) values (true);

alter table public.etoro_portfolio_cache enable row level security;

-- Cached holdings carry no secret material and feed the public MEIF page.
create policy "public read etoro portfolio cache" on public.etoro_portfolio_cache
  for select using (true);

-- No insert/update/delete policy: only the etoro-portfolio Edge Function
-- (service_role, which bypasses RLS) refreshes this row.
