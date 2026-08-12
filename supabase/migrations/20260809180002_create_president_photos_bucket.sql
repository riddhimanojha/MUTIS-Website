insert into storage.buckets (id, name, public)
values ('president_photos', 'president_photos', true)
on conflict (id) do nothing;

create policy "admin write president_photos" on storage.objects
  for all
  using (bucket_id = 'president_photos' and public.is_admin())
  with check (bucket_id = 'president_photos' and public.is_admin());
