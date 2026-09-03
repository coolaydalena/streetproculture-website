-- Street Pro Culture — product-images storage bucket + policies.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MiB
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects already has RLS enabled by Supabase. Add bucket-scoped policies.

drop policy if exists "streetproculture product-images read" on storage.objects;
create policy "streetproculture product-images read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "streetproculture product-images insert" on storage.objects;
create policy "streetproculture product-images insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_superadmin());

drop policy if exists "streetproculture product-images update" on storage.objects;
create policy "streetproculture product-images update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_superadmin())
  with check (bucket_id = 'product-images' and public.is_superadmin());

drop policy if exists "streetproculture product-images delete" on storage.objects;
create policy "streetproculture product-images delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_superadmin());
