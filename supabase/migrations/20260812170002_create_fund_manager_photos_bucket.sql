insert into storage.buckets (id, name, public)
values ('fund_manager_photos', 'fund_manager_photos', true)
on conflict (id) do nothing;

create policy "admin write fund_manager_photos" on storage.objects
  for all
  using (bucket_id = 'fund_manager_photos' and public.is_admin())
  with check (bucket_id = 'fund_manager_photos' and public.is_admin());
