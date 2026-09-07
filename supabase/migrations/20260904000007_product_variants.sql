-- Street Pro Culture — product variants.
--
-- Until now a product was a single buyable unit: one `price`, one
-- `stock_quantity`. The supplier catalogue is overwhelmingly one model in many
-- colourways, so price / stock / SKU move onto a child `streetproculture_product_variants`
-- row and every product now has one or more variants (a "simple" product is just
-- one variant labelled "Default").
--
-- `compare_at_price` is the per-variant "was" price — the storefront shows a
-- strikethrough + % off when it is set above `price`.

create table public.streetproculture_product_variants (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null
                     references public.streetproculture_products (id) on delete cascade,
  -- Shown in the variant picker, e.g. "Sport — Nero Rosso Opaco", "45L Black".
  label            text not null,
  -- Supplier SKU / article code (e.g. "333G-ALV-03"). Optional, not unique
  -- (suppliers occasionally reuse codes across regions).
  sku              text,
  -- Whole-peso amount (no centavos), same convention the product price used to
  -- follow. Paymongo converts to centavos at checkout.
  price            integer not null check (price >= 0),
  -- Optional "original" price. When > price the storefront renders a
  -- strikethrough and a discount badge; checkout still charges `price`.
  compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
  -- false => infinite stock. true => stock_quantity is authoritative.
  track_inventory  boolean not null default true,
  stock_quantity   integer check (stock_quantity is null or stock_quantity >= 0),
  -- Which media row represents this variant (swaps the gallery on selection).
  image_id         uuid references public.streetproculture_product_images (id)
                     on delete set null,
  position         integer not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint streetproculture_product_variants_label_unique
    unique (product_id, label),
  constraint streetproculture_product_variants_compare_gt_price
    check (compare_at_price is null or compare_at_price >= price)
);

create index streetproculture_product_variants_product_pos_idx
  on public.streetproculture_product_variants (product_id, position);
create index streetproculture_product_variants_sku_idx
  on public.streetproculture_product_variants (sku)
  where sku is not null;

create trigger streetproculture_product_variants_set_updated_at
  before update on public.streetproculture_product_variants
  for each row execute function public.streetproculture_set_updated_at();

-- ---------------------------------------------------------------------------
-- Backfill: one variant per existing product, carrying its price/stock.
-- ---------------------------------------------------------------------------
insert into public.streetproculture_product_variants
  (product_id, label, price, track_inventory, stock_quantity, position, is_active)
select id, 'Default', price, track_inventory, stock_quantity, 0, true
  from public.streetproculture_products;

-- Price / stock authority now lives on the variant.
alter table public.streetproculture_products drop column price;
alter table public.streetproculture_products drop column track_inventory;
alter table public.streetproculture_products drop column stock_quantity;

-- New 5th category for visors / pinlocks / cushions and other spare parts.
alter table public.streetproculture_products
  drop constraint streetproculture_products_category_check;
alter table public.streetproculture_products
  add constraint streetproculture_products_category_check
  check (category in ('caps', 'helmets', 'cases', 'merch', 'parts'));

-- Long-form product description (plain text, blank lines between paragraphs).
-- `blurb` stays the one-line summary used on cards + the <meta> description;
-- `description` is the fuller copy rendered on the product page. Both are
-- generated for the supplier catalogue and editable in /admin.
alter table public.streetproculture_products
  add column description text not null default '';

-- ---------------------------------------------------------------------------
-- RLS — mirrors streetproculture_product_images.
-- ---------------------------------------------------------------------------
alter table public.streetproculture_product_variants enable row level security;

-- active variants of published products are public
create policy streetproculture_product_variants_public_read
  on public.streetproculture_product_variants
  for select
  to anon, authenticated
  using (is_active and exists (
    select 1
      from public.streetproculture_products p
     where p.id = product_id and p.is_published
  ));

create policy streetproculture_product_variants_admin_read
  on public.streetproculture_product_variants
  for select
  to authenticated
  using (public.is_superadmin());

create policy streetproculture_product_variants_admin_write
  on public.streetproculture_product_variants
  for all
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());
