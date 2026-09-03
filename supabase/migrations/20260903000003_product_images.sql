-- Street Pro Culture — product images (multiple per product, one primary).

create table public.streetproculture_product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null
                 references public.streetproculture_products (id) on delete cascade,
  -- For uploaded images: the object key inside the `product-images` storage
  -- bucket (e.g. "<product_id>/<uuid>.jpg").
  -- For seeded images (is_uploaded = false): a site-relative /public URL that is
  -- rendered as-is (e.g. "/images/products/checker-snapback.jpg").
  storage_path text not null,
  is_uploaded  boolean not null default true,
  alt          text not null default '',
  sort_order   integer not null default 0,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- At most one primary image per product.
create unique index streetproculture_product_images_one_primary
  on public.streetproculture_product_images (product_id)
  where is_primary;

create index streetproculture_product_images_product_order_idx
  on public.streetproculture_product_images (product_id, sort_order);

-- When the primary image is deleted, promote the next image (by sort order) so a
-- product with images always has exactly one primary.
create or replace function public.streetproculture_reassign_primary_image()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.is_primary then
    update public.streetproculture_product_images
       set is_primary = true
     where id = (
       select id
         from public.streetproculture_product_images
        where product_id = old.product_id
        order by sort_order, created_at
        limit 1
     );
  end if;
  return old;
end;
$$;

create trigger streetproculture_product_images_reassign_primary
  after delete on public.streetproculture_product_images
  for each row execute function public.streetproculture_reassign_primary_image();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.streetproculture_product_images enable row level security;

-- images of published products are public
create policy streetproculture_product_images_public_read
  on public.streetproculture_product_images
  for select
  to anon, authenticated
  using (exists (
    select 1
      from public.streetproculture_products p
     where p.id = product_id and p.is_published
  ));

create policy streetproculture_product_images_admin_read
  on public.streetproculture_product_images
  for select
  to authenticated
  using (public.is_superadmin());

create policy streetproculture_product_images_admin_write
  on public.streetproculture_product_images
  for all
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());
