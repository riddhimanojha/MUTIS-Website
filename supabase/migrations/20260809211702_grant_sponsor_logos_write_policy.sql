-- The sponsor_logos storage bucket existed (created out-of-band, before
-- migration tracking started) but had no write policy on storage.objects,
-- so admin uploads to it were silently denied by RLS. This mirrors the
-- "admin write {bucket}" policy pattern already used by the other five
-- content buckets (committee_photos, event_photos, alumni_photos,
-- article_covers, president_photos).
create policy "admin write sponsor_logos" on storage.objects
  for all
  using (bucket_id = 'sponsor_logos' and public.is_admin())
  with check (bucket_id = 'sponsor_logos' and public.is_admin());
