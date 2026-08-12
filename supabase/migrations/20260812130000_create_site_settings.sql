create table public.site_settings (
  id                  integer primary key default 1,
  member_count_label  text not null default '1,000+',
  founding_year       integer not null default 2005,
  contact_email       text not null default 'mutis@manchesterstudentsunion.com',
  instagram_url       text not null default 'https://instagram.com/mutisfinancesoc',
  linkedin_url        text not null default 'https://www.linkedin.com/company/manchester-university-trading-&-investment-society/',
  su_signup_url       text not null default 'https://manchesterstudentsunion.com/activities/view/mutis',
  updated_at          timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1);

alter table public.site_settings enable row level security;

create policy "public read site_settings" on public.site_settings
  for select using (true);

create policy "admin write site_settings" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());
