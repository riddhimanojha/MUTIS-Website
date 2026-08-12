insert into storage.buckets (id, name, public)
values ('event_photos', 'event_photos', true)
on conflict (id) do nothing;

create policy "admin write event_photos" on storage.objects
  for all
  using (bucket_id = 'event_photos' and public.is_admin())
  with check (bucket_id = 'event_photos' and public.is_admin());
