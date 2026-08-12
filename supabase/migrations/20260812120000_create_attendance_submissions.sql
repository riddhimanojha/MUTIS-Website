create table public.attendance_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  course     text not null,
  year       text not null,
  rating     integer not null check (rating between 1 and 10),
  comments   text,
  status     text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

alter table public.attendance_submissions enable row level security;

create policy "public can submit attendance_submissions" on public.attendance_submissions
  for insert to anon, authenticated with check (true);

create policy "admin can read attendance_submissions" on public.attendance_submissions
  for select using (public.is_admin());

create policy "admin can update attendance_submissions" on public.attendance_submissions
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete attendance_submissions" on public.attendance_submissions
  for delete using (public.is_admin());
