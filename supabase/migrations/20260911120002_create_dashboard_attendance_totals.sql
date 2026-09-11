-- Single-row aggregate for the admin Dashboard: total confirmed
-- registrations, unique attendees (by email, from event_signups — the RSVP
-- table, per product decision), and an upcoming/past event split. Computed
-- in Postgres so the Dashboard numbers are guaranteed to match a direct SQL
-- count rather than being derived from a paginated client-side fetch.
create view public.dashboard_attendance_totals
with (security_invoker = on) as
select
  (select count(*) from public.events) as total_events,
  (select count(*) from public.events where starts_at >= now()) as upcoming_events,
  (select count(*) from public.events where starts_at < now()) as past_events,
  (select count(*) from public.event_signups where status = 'confirmed') as total_signups,
  (select count(distinct lower(email)) from public.event_signups where status = 'confirmed') as unique_attendees;

grant select on public.dashboard_attendance_totals to authenticated;
