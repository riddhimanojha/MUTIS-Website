insert into storage.buckets (id, name, public)
values ('article_covers', 'article_covers', true)
on conflict (id) do nothing;

create policy "admin write article_covers" on storage.objects
  for all
  using (bucket_id = 'article_covers' and public.is_admin())
  with check (bucket_id = 'article_covers' and public.is_admin());
