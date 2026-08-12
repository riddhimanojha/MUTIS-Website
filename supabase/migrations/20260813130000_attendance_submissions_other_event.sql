alter table public.attendance_submissions
  alter column event_id drop not null,
  add column other_event_name text,
  add constraint attendance_submissions_event_check check (
    (event_id is not null and other_event_name is null) or
    (event_id is null and other_event_name is not null)
  );
