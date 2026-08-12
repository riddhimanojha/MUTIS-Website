alter table public.attendance_submissions
  add column event_id uuid not null references public.events(id) on delete cascade;
