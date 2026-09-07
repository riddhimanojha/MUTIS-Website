-- Attendance form rating changed from a 1-10 slider to a 5-box scale.
-- `not valid` so this doesn't fail if any existing rows have ratings 6-10.
alter table public.attendance_submissions
  drop constraint attendance_submissions_rating_check,
  add constraint attendance_submissions_rating_check check (rating between 1 and 5) not valid;
