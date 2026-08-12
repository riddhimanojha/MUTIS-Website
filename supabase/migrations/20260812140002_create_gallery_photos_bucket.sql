insert into storage.buckets (id, name, public)
values ('gallery_photos', 'gallery_photos', true)
on conflict (id) do nothing;

create policy "admin write gallery_photos" on storage.objects
  for all
  using (bucket_id = 'gallery_photos' and public.is_admin())
  with check (bucket_id = 'gallery_photos' and public.is_admin());
