-- Staging bucket for headshots uploaded via the public alumni registration
-- form. Kept separate from alumni_photos (the curated, published-directory
-- bucket keyed by alumni.id) since a submission isn't reviewed yet. Anon can
-- only insert (upload), never overwrite or delete another visitor's file;
-- admin has full access to review/remove/move photos when approving or
-- rejecting a submission.
insert into storage.buckets (id, name, public)
values ('alumni_submission_photos', 'alumni_submission_photos', true)
on conflict (id) do nothing;

create policy "public can upload alumni_submission_photos" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'alumni_submission_photos');

create policy "admin manage alumni_submission_photos" on storage.objects
  for all
  using (bucket_id = 'alumni_submission_photos' and public.is_admin())
  with check (bucket_id = 'alumni_submission_photos' and public.is_admin());
