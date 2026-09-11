-- Postgres becomes the source of truth for per-event registration/attendance
-- counts, replacing client-side counting of unbounded .select() results
-- (application/app/admin/pages/Events.tsx), which silently undercounts once
-- a table passes PostgREST's default 1,000-row page size.
--
-- security_invoker means this view enforces RLS as the calling user, not the
-- view owner: an admin sees real counts, everyone else sees the same nothing
-- they'd see querying event_signups/attendance_submissions directly.
create view public.event_attendance_stats
with (security_invoker = on) as
select
  e.id as event_id,
  e.title,
  e.starts_at,
  e.capacity,
  coalesce(s.signup_count, 0) as signup_count,
  coalesce(a.attendance_count, 0) as attendance_count
from public.events e
left join (
  select event_id, count(*) as signup_count
  from public.event_signups
  where status = 'confirmed'
  group by event_id
) s on s.event_id = e.id
left join (
  select event_id, count(*) as attendance_count
  from public.attendance_submissions
  where event_id is not null
  group by event_id
) a on a.event_id = e.id;

grant select on public.event_attendance_stats to authenticated;
