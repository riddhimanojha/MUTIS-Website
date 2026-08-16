-- The "documents" bucket was created but never actually used (no objects
-- were ever uploaded to it — the admin uploader was broken). Replacing it
-- with a purpose-named "meif_files" bucket. The empty "documents" bucket
-- itself is left behind (storage.buckets rows can't be deleted via SQL —
-- "Direct deletion from storage tables is not allowed" — only via the
-- Storage API/dashboard), but its write policy is dropped so nothing can
-- write to it anymore.
drop policy if exists "admin write documents bucket" on storage.objects;

insert into storage.buckets (id, name, public)
values ('meif_files', 'meif_files', true)
on conflict (id) do nothing;

create policy "admin write meif_files bucket" on storage.objects
  for all
  using (bucket_id = 'meif_files' and public.is_admin())
  with check (bucket_id = 'meif_files' and public.is_admin());
