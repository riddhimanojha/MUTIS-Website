insert into storage.buckets (id, name, public)
values ('speaker_photos', 'speaker_photos', true)
on conflict (id) do nothing;

create policy "admin write speaker_photos" on storage.objects
  for all
  using (bucket_id = 'speaker_photos' and public.is_admin())
  with check (bucket_id = 'speaker_photos' and public.is_admin());
