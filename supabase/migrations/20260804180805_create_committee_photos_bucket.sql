insert into storage.buckets (id, name, public)
values ('committee_photos', 'committee_photos', true)
on conflict (id) do nothing;

create policy "admin write committee_photos" on storage.objects
  for all
  using (bucket_id = 'committee_photos' and public.is_admin())
  with check (bucket_id = 'committee_photos' and public.is_admin());
