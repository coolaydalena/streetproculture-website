-- Street Pro Culture — product video support.
--
-- streetproculture_product_images becomes "product media": an image row (the
-- default, unchanged) or a video row. Videos live in their own storage bucket
-- (`product-videos`) because the image bucket's mime allow-list is locked to
-- raster formats. `is_primary` / the reassign-primary trigger stay image-only.

alter table public.streetproculture_product_images
  add column media_type text not null default 'image'
    constraint streetproculture_product_images_media_type_check
    check (media_type in ('image', 'video'));

-- ---------------------------------------------------------------------------
-- product-videos storage bucket + policies (copy of 0004_storage.sql).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-videos',
  'product-videos',
  true,
  52428800, -- 50 MiB
  array['video/mp4', 'video/webm']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "streetproculture product-videos read" on storage.objects;
create policy "streetproculture product-videos read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-videos');

drop policy if exists "streetproculture product-videos insert" on storage.objects;
create policy "streetproculture product-videos insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-videos' and public.is_superadmin());

drop policy if exists "streetproculture product-videos update" on storage.objects;
create policy "streetproculture product-videos update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-videos' and public.is_superadmin())
  with check (bucket_id = 'product-videos' and public.is_superadmin());

drop policy if exists "streetproculture product-videos delete" on storage.objects;
create policy "streetproculture product-videos delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-videos' and public.is_superadmin());
