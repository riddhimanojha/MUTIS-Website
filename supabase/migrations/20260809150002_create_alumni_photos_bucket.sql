insert into storage.buckets (id, name, public)
values ('alumni_photos', 'alumni_photos', true)
on conflict (id) do nothing;

create policy "admin write alumni_photos" on storage.objects
  for all
  using (bucket_id = 'alumni_photos' and public.is_admin())
  with check (bucket_id = 'alumni_photos' and public.is_admin());
