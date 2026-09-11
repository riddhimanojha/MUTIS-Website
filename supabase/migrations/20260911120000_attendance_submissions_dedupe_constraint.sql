-- Prevent the same person submitting the post-event feedback form twice for
-- the same event. event_signups already has an equivalent unique(event_id,
-- email); attendance_submissions had none. Case-insensitive on email since
-- the client doesn't normalize casing before insert. event_id is nullable
-- (an "other event" submission uses other_event_name instead), so this is a
-- partial index that only applies once an event is actually linked.
create unique index attendance_submissions_event_email_uidx
  on public.attendance_submissions (event_id, lower(email))
  where event_id is not null;
