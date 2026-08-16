create table public.etoro_settings (
  id            boolean primary key default true,
  is_configured boolean not null default false,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references public.admin_users(user_id),
  constraint etoro_settings_singleton check (id)
);

insert into public.etoro_settings (id) values (true);

alter table public.etoro_settings enable row level security;

create policy "admin read etoro settings" on public.etoro_settings
  for select using (public.is_admin());

create policy "admin write etoro settings" on public.etoro_settings
  for all using (public.is_admin()) with check (public.is_admin());
