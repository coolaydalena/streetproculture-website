-- Street Pro Culture supplier catalogue — generated from
-- scripts/catalog/manifest.json (2026-09-07T08:46:02.814Z) by `npm run catalog:sql`.
-- Do not edit by hand.
--
-- Idempotent. New products insert unpublished (is_published=false, is_mock=true).
-- A re-run syncs name/category/tag/brand/specs/blurb/description + variant
-- sku/price/position; it never changes compare_at_price, stock_quantity,
-- is_active or the publish flags. (blurb/description are generated here — edit
-- them in /admin *after* your final catalog.sql run, or they'll be overwritten.)
-- For a clean reload (drop upstream-removed products): run reset.sql first.
--
-- 48 products (22 parts), 259 variants.

begin;

-- ======================================================================
-- X-Land S-Series Top Case  (cases, 1 variant)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('x-land-s-series-top-case', 'X-Land S-Series Top Case', 'cases', 'X-LAND', 'X-Land', 'X-Land S-Series 45L motorcycle top case — hard-plastic rear box that locks to a standard luggage rack, room for one full-face helmet.', 'The X-Land S-Series is the entry-level top case in the X-Land line: a 45-litre hard-plastic rear box that bolts to a standard motorcycle luggage rack and locks shut, swallowing a full-face helmet or a day''s shopping without a bungee net in sight.

External size is 42×36×34 cm. It ships in black.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Capacity","value":"45 L"},{"label":"Shell","value":"Hard plastic"},{"label":"External size","value":"42×36×34 cm"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Black', 'S-45-B', 3250, null, true, 0, 0, true
from public.streetproculture_products where slug = 'x-land-s-series-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- X-Land H-Series Aluminium Top Case  (cases, 15 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('x-land-h-series-aluminium-top-case', 'X-Land H-Series Aluminium Top Case', 'cases', 'X-LAND', 'X-Land', 'X-Land H-Series aluminium top case in 45 / 55 / 65 L — 1.2 mm alloy shell, lockable, mounts to a standard rear rack. Five finishes.', 'The X-Land H-Series is X-Land''s core aluminium top case — a 1.2 mm alloy shell with welded seams, a weather lip and a barrel lock, built for commuters and weekend tourers who want a box that shrugs off knocks and looks the part.

Pick your capacity: 45 L holds one full-face helmet, 55 L takes a helmet plus a jacket, and 65 L is a genuine two-up touring box. External sizes run 42×36×34 cm to 57×38×34 cm. Every size comes in Black, Silver, Chrome Black, Colorful and Special Silver — 15 combinations in all. Sizes and part numbers are listed on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Capacity","value":"45 / 55 / 65 L"},{"label":"Shell","value":"1.2 mm aluminium alloy"},{"label":"External size","value":"42×36×34 – 57×38×34 cm"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Black', 'H-45-B', 5650, null, true, 0, 0, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Silver', 'H-45-S', 5650, null, true, 0, 1, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Chrome Black', 'H-45-CB', 5650, null, true, 0, 2, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Colorful', 'H-45-CL', 5650, null, true, 0, 3, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Special Silver', 'H-45-SS', 5650, null, true, 0, 4, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Black', 'H-55-B', 5950, null, true, 0, 5, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Silver', 'H-55-S', 5950, null, true, 0, 6, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Chrome Black', 'H-55-CB', 5950, null, true, 0, 7, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Colorful', 'H-55-CL', 5950, null, true, 0, 8, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Special Silver', 'H-55-SS', 5950, null, true, 0, 9, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Black', 'H-65-B', 6850, null, true, 0, 10, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Silver', 'H-65-S', 6850, null, true, 0, 11, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Chrome Black', 'H-65-CB', 6850, null, true, 0, 12, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Colorful', 'H-65-CL', 6850, null, true, 0, 13, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Special Silver', 'H-65-SS', 6850, null, true, 0, 14, true
from public.streetproculture_products where slug = 'x-land-h-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- X-Land M-Series Aluminium Top Case  (cases, 6 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('x-land-m-series-aluminium-top-case', 'X-Land M-Series Aluminium Top Case', 'cases', 'X-LAND', 'X-Land', 'X-Land M-Series aluminium top case, 45 / 55 / 65 L — smooth-sided 1.2 mm alloy shell, lockable rear box in black or silver.', 'The X-Land M-Series is a cleaner-lined 1.2 mm aluminium top case for riders who want the alloy build without the textured panels — a smooth-sided lockable rear box in three capacities.

45, 55 and 65 L, each in Black or Silver. External sizes 42×36×34 cm to 57×38×34 cm. It mounts to a standard motorcycle luggage rack.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Capacity","value":"45 / 55 / 65 L"},{"label":"Shell","value":"1.2 mm aluminium alloy"},{"label":"External size","value":"42×36×34 – 57×38×34 cm"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Black', 'M-45-B', 5650, null, true, 0, 0, true
from public.streetproculture_products where slug = 'x-land-m-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Silver', 'M-45-S', 5650, null, true, 0, 1, true
from public.streetproculture_products where slug = 'x-land-m-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Black', 'M-55-B', 5950, null, true, 0, 2, true
from public.streetproculture_products where slug = 'x-land-m-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Silver', 'M-55-S', 5950, null, true, 0, 3, true
from public.streetproculture_products where slug = 'x-land-m-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Black', 'M-65-B', 6850, null, true, 0, 4, true
from public.streetproculture_products where slug = 'x-land-m-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Silver', 'M-65-S', 6850, null, true, 0, 5, true
from public.streetproculture_products where slug = 'x-land-m-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- X-Land Y-Series Aluminium Top Case  (cases, 6 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('x-land-y-series-aluminium-top-case', 'X-Land Y-Series Aluminium Top Case', 'cases', 'X-LAND', 'X-Land', 'X-Land Y-Series heavy-duty aluminium top case — thicker 1.5 mm alloy shell, 45 / 55 / 65 L, black or silver.', 'The X-Land Y-Series is the heavy-duty option: the same lockable X-Land top-case design in a thicker 1.5 mm aluminium alloy for riders loading the box hard — long tours, rough roads, daily heavy use.

Three capacities (45 / 55 / 65 L) in Black or Silver, external sizes 42×36×34 cm to 57×38×34 cm. Fits a standard rear luggage rack.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Capacity","value":"45 / 55 / 65 L"},{"label":"Shell","value":"1.5 mm aluminium alloy"},{"label":"External size","value":"42×36×34 – 57×38×34 cm"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Black', 'Y-45-B', 7450, null, true, 0, 0, true
from public.streetproculture_products where slug = 'x-land-y-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '45L Silver', 'Y-45-S', 7450, null, true, 0, 1, true
from public.streetproculture_products where slug = 'x-land-y-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Black', 'Y-55-B', 7950, null, true, 0, 2, true
from public.streetproculture_products where slug = 'x-land-y-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '55L Silver', 'Y-55-S', 7950, null, true, 0, 3, true
from public.streetproculture_products where slug = 'x-land-y-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Black', 'Y-65-B', 8450, null, true, 0, 4, true
from public.streetproculture_products where slug = 'x-land-y-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '65L Silver', 'Y-65-S', 8450, null, true, 0, 5, true
from public.streetproculture_products where slug = 'x-land-y-series-aluminium-top-case'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- NZI Fibra Atto Duo  (helmets, 4 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('nzi-fibra-atto-duo', 'NZI Fibra Atto Duo', 'helmets', 'NZI', 'NZI', 'NZI Fibra Atto Duo modular helmet — Spanish fibreglass flip-up with a drop-down sun visor and a clear outer visor. Four graphics.', 'The NZI Fibra Atto Duo is a modular (flip-up) helmet from NZI of Spain, built on a fibreglass shell and finished to European ECE safety standards. The chin bar lifts for a full open-face feel at the lights; drop the internal sun visor and you''re covered without swapping the clear outer visor.

Four finishes — Olas Black & Blue, Olas Black & Red, Matt Black and White. Each ships with a clear visor fitted.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full Face Modular"},{"label":"Shell","value":"Fibreglass"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Olas Black & Blue', '150384A011V2', 4250, null, true, 0, 0, true
from public.streetproculture_products where slug = 'nzi-fibra-atto-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Olas Black & Red', '150384A009V2', 4250, null, true, 0, 1, true
from public.streetproculture_products where slug = 'nzi-fibra-atto-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Matt Black', '150384A003V2', 3750, null, true, 0, 2, true
from public.streetproculture_products where slug = 'nzi-fibra-atto-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'White', '150384A007V2', 3750, null, true, 0, 3, true
from public.streetproculture_products where slug = 'nzi-fibra-atto-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- NZI Fibra Exa Duo  (helmets, 4 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('nzi-fibra-exa-duo', 'NZI Fibra Exa Duo', 'helmets', 'NZI', 'NZI', 'NZI Fibra Exa Duo full-face helmet — fibreglass shell, dual-visor (clear outer + drop-down sun visor). Bobber, Braden and Delvon graphics.', 'The NZI Fibra Exa Duo is a dual-visor full-face from NZI Spain — a fibreglass shell with a built-in retractable sun visor alongside the clear outer visor, so you''re set for a bright ride home without carrying a tinted spare.

Four graphics — Bobber White & Red, Bobber White & Grey, Braden Black & Neon Matt and Delvon Black & Red — each with a clear visor included.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full Face Double Visor"},{"label":"Shell","value":"Fibreglass"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bobber White & Red', '150344A562V2', 4250, null, true, 0, 0, true
from public.streetproculture_products where slug = 'nzi-fibra-exa-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bobber White & Grey', '150344A560V2', 4250, null, true, 0, 1, true
from public.streetproculture_products where slug = 'nzi-fibra-exa-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Braden Black & Neon Matt', '150344A567V2', 4250, null, true, 0, 2, true
from public.streetproculture_products where slug = 'nzi-fibra-exa-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Delvon Black & Red', '150344A576V2', 4250, null, true, 0, 3, true
from public.streetproculture_products where slug = 'nzi-fibra-exa-duo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- NZI Fibra Giga  (helmets, 7 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('nzi-fibra-giga', 'NZI Fibra Giga', 'helmets', 'NZI', 'NZI', 'NZI Fibra Giga full-face helmet — lightweight Spanish fibreglass shell, single clear visor, seven graphics.', 'The NZI Fibra Giga is NZI Spain''s everyday full-face: a light fibreglass lay-up, a wide single clear visor and a snug fit favoured by commuters and cafe riders. Built to European ECE standards.

Seven finishes — Veneno Antracite, Tecno Black & Orange, Falcon Black & Pink Matt, Global Black & Red Matt, Global Black & Blue, Venom Black & Red and Solid Noveau White. Graphic names and part numbers are on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full Face Single Visor"},{"label":"Shell","value":"Fibreglass"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Veneno Antracite', '150331A625V2', 3950, null, true, 0, 0, true
from public.streetproculture_products where slug = 'nzi-fibra-giga'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Tecno Black & Orange', '150330A631V2', 3950, null, true, 0, 1, true
from public.streetproculture_products where slug = 'nzi-fibra-giga'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Falcon Black & Pink Matt', '150330A456V2', 3950, null, true, 0, 2, true
from public.streetproculture_products where slug = 'nzi-fibra-giga'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Global Black & Red Matt', '150330A459V2', 3950, null, true, 0, 3, true
from public.streetproculture_products where slug = 'nzi-fibra-giga'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Global Black & Blue', '150330A379V2', 3950, null, true, 0, 4, true
from public.streetproculture_products where slug = 'nzi-fibra-giga'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Venom Black & Red', '150330A365V2', 3950, null, true, 0, 5, true
from public.streetproculture_products where slug = 'nzi-fibra-giga'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Solid Noveau White', '150330A649V2', 3650, null, true, 0, 6, true
from public.streetproculture_products where slug = 'nzi-fibra-giga'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- NZI Fibra Byte Stream  (helmets, 3 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('nzi-fibra-byte-stream', 'NZI Fibra Byte Stream', 'helmets', 'NZI', 'NZI', 'NZI Fibra Byte Stream full-face helmet — fibreglass shell, single clear visor, three graphics.', 'The NZI Fibra Byte Stream is a single-visor full-face from NZI Spain on a fibreglass shell — a straightforward, road-legal lid for daily riding.

Three finishes — Extreme Black & Antracite & Red, Plieger Blue & White & Red and Matt Black — each with a clear visor fitted.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full Face Single Visor"},{"label":"Shell","value":"Fibreglass"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Extreme Black & Antracite & Red', '150354A808V2', 3650, null, true, 0, 0, true
from public.streetproculture_products where slug = 'nzi-fibra-byte-stream'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Plieger Blue & White & Red', '150354A675V2', 3650, null, true, 0, 1, true
from public.streetproculture_products where slug = 'nzi-fibra-byte-stream'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Matt Black', '150354A622V2', 3350, null, true, 0, 2, true
from public.streetproculture_products where slug = 'nzi-fibra-byte-stream'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- NZI Fibra One Bit  (helmets, 7 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('nzi-fibra-one-bit', 'NZI Fibra One Bit', 'helmets', 'NZI', 'NZI', 'NZI Fibra One Bit open-face helmet — fibreglass three-quarter lid with a clear flip visor, seven graphics.', 'The NZI Fibra One Bit is a fibreglass open-face (three-quarter) helmet from NZI Spain — the classic cafe and city silhouette with a clip-in clear visor and an ECE-standard build.

Seven finishes across the Lander, Thunder and Solid Nouveau lines. Colourways and part numbers are listed below.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Open Face"},{"label":"Shell","value":"Fibreglass"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Lander Black & Antracite & Red', '150385A158V14', 2650, null, true, 0, 0, true
from public.streetproculture_products where slug = 'nzi-fibra-one-bit'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Lander Blue & Grey', '150385A162V14', 2650, null, true, 0, 1, true
from public.streetproculture_products where slug = 'nzi-fibra-one-bit'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Lander Nardo Grey & Black', '150385A164V14', 2650, null, true, 0, 2, true
from public.streetproculture_products where slug = 'nzi-fibra-one-bit'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Thunder Black & Yellow', '150385A180V14', 2650, null, true, 0, 3, true
from public.streetproculture_products where slug = 'nzi-fibra-one-bit'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Thunder Blue & White', '150385A182V14', 2650, null, true, 0, 4, true
from public.streetproculture_products where slug = 'nzi-fibra-one-bit'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Thunder White & Blue & Red', '150385A188V14', 2650, null, true, 0, 5, true
from public.streetproculture_products where slug = 'nzi-fibra-one-bit'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Solid Nouveau Black & Silver Matt', '150385A111V14', 2450, null, true, 0, 6, true
from public.streetproculture_products where slug = 'nzi-fibra-one-bit'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 361 AVENT  (helmets, 4 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-361-avent', 'CGM 361 AVENT', 'helmets', 'CGM', 'CGM', 'CGM 361 Avent Pro — carbon-shell full-face helmet from CGM Italia, Pinlock 70 anti-fog lens included. Four carbon finishes.', 'The CGM 361 Avent Pro is CGM Italia''s flagship full-face: a real carbon-fibre shell for low weight and high rigidity, with a Pinlock 70 anti-fog lens already in the box and the visor pinned to take it. Built to European ECE standards.

Four carbon finishes across the Avent Pro and Avent Pro Sport lines — Carbon Nero Opaco, Carbon Nero, Carbon Rosso Opaco and Carbon Giallo Fluo Opaco.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full-face"},{"label":"Shell","value":"Carbon"},{"label":"Pinlock","value":"Pinlock 70 lens included"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Pro — Carbon Nero Opaco', '361C-ALV-01', 21500, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-361-avent'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Pro — Carbon Nero', '361C-ALV-83', 21500, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-361-avent'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Pro Sport — Carbon Rosso Opaco', '361G-ALV-03', 22500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-361-avent'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Pro Sport — Carbon Giallo Fluo Opaco', '361G-ALV-19', 22500, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-361-avent'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 363 SHOT  (helmets, 5 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-363-shot', 'CGM 363 SHOT', 'helmets', 'CGM', 'CGM', 'CGM 363 Shot full-face helmet — CGM Italia, high-performance terpolymer shell, Pinlock 70-ready visor. Mono, Race, Nippo and Run graphics.', 'The CGM 363 Shot is a sport-styled full-face from CGM Italia on a high-performance terpolymer shell, with a visor that''s already pinned for a Pinlock 70 anti-fog lens (lens optional, DKS002CGMCL). ECE-standard European build.

Five finishes across the Mono, Race, Nippo and Run lines — colourways and part numbers on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '363A-ALV-01', 9250, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-363-shot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '363A-ALV-14', 9250, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-363-shot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Race — Antracite Rosso Opaco', '363G-ALV-03', 10250, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-363-shot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Nippo — Nero Giallo Fluo Opaco', '363S-ALV-19', 10250, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-363-shot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Run — Nero Fucsia Fluo Opaco', '363X-ALV-20', 10250, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-363-shot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 333 ONYX  (helmets, 9 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-333-onyx', 'CGM 333 ONYX', 'helmets', 'CGM', 'CGM', 'CGM 333 Onyx full-face helmet — CGM Italia, terpolymer shell, Pinlock 70-ready visor. Nine Mono and Sport colourways.', 'The CGM 333 Onyx is CGM Italia''s value full-face — a high-performance terpolymer shell, a wide clear visor pinned for a Pinlock 70 anti-fog lens (optional, DKS002CGMCL), and an easy all-day fit. Built to European ECE safety standards.

Nine colourways: the plain-styled Mono line (Nero Opaco, Blu Satinato, Grafite Opaco, Bianco) and the graphic Sport line (Nero Rosso Opaco, Grigio Verde Fluo Opaco, Nero Giallo Fluo Opaco, Blu Giallo Fluo, Grigio Rosa Fluo). Every colourway and its part number is listed below.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '333A-ALV-01', 7750, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Blu Satinato', '333A-ALV-06', 7750, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Grafite Opaco', '333A-ALV-09', 7750, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '333A-ALV-14', 7750, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Rosso Opaco', '333G-ALV-03', 8500, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Grigio Verde Fluo Opaco', '333G-ALV-07', 8500, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Giallo Fluo Opaco', '333G-ALV-19', 8500, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Blu Giallo Fluo', '333G-ALV-79', 8500, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Grigio Rosa Fluo', '333G-ALV-94', 8500, null, true, 0, 8, true
from public.streetproculture_products where slug = 'cgm-333-onyx'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 311 BLAST  (helmets, 10 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-311-blast', 'CGM 311 BLAST', 'helmets', 'CGM', 'CGM', 'CGM 311 Blast full-face helmet — CGM Italia, terpolymer shell with a Fog City anti-fog insert included. Ten graphics.', 'The CGM 311 Blast is a graphic-heavy full-face from CGM Italia built on a terpolymer shell, and it ships with a Fog City anti-fog insert already included — clear vision on cold and wet mornings with nothing extra to buy. ECE-standard European build.

Ten finishes across the Mono, Sport, Maya, Race, Jelly and Skull lines. Colourways and part numbers are on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Fog City anti-fog insert included"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '311A-ALV-01', 6750, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bigio', '311A-ALV-66', 6750, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Giallo Fluo Opaco', '311G-ALV-19', 7500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Bianco Blu', '311G-ALV-79', 7500, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Maya — Nero Rosso Opaco', '311M-ALV-03', 7500, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Maya — Nero Arancione Azzurro', '311M-ALV-87', 7500, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Race — Antracite Rosso Opaco', '311R-ALV-03', 7500, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Race — Nero Giallo Fluo', '311R-ALV-93', 7500, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Jelly — Nero Viola', '311S-ALV-83', 7500, null, true, 0, 8, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Skull — Nero Blu Rosso Opaco', '311X-ALV-01', 7500, null, true, 0, 9, true
from public.streetproculture_products where slug = 'cgm-311-blast'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 330 RIOT  (helmets, 6 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-330-riot', 'CGM 330 RIOT', 'helmets', 'CGM', 'CGM', 'CGM 330 Riot full-face helmet — CGM Italia''s most affordable full-face, terpolymer shell, Pinlock 70-ready visor. Six graphics.', 'The CGM 330 Riot is CGM Italia''s most affordable full-face — a terpolymer shell, a clear visor pinned for a Pinlock 70 anti-fog lens (optional), and bold youth-market graphics. A solid first proper helmet, built to European ECE standards.

Six finishes across the Mono, Sport, Ripper, Space and Undead lines — see the table below for colourways and part numbers.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '330A-ALA-01', 5750, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-330-riot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '330A-ALA-14', 5750, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-330-riot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Giallo Fluo Opaco', '330G-ALA-19', 6500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-330-riot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Ripper — Nero Verde Giallo Fluo', '330R-ALA-89', 6500, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-330-riot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Space — Bianco Nero Rosso', '330S-ALA-85', 6500, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-330-riot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Undead — Azzurro Rosa', '330U-ALA-73', 6500, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-330-riot'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 560 MAD  (helmets, 4 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-560-mad', 'CGM 560 MAD', 'helmets', 'CGM', 'CGM', 'CGM 560 Mad modular helmet — CGM Italia, fibreglass shell flip-up with a Pinlock 70 lens included and a drop-down sun visor.', 'The CGM 560 Mad is CGM Italia''s premium modular (flip-up) helmet: a fibreglass shell, an internal drop-down sun visor, and a Pinlock 70 anti-fog lens already in the box. Ride it closed as a full-face or flip the chin bar up at a stop. ECE-standard European build.

Four finishes across the Mad Mono and Mad Ride lines — Nero Opaco, Bianco, Nero Rosso Opaco and Grafite Giallo Fluo Opaco.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Modular (flip-up)"},{"label":"Shell","value":"Fibreglass"},{"label":"Pinlock","value":"Pinlock 70 lens included"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '560A-ALV-01', 18500, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-560-mad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '560A-ALV-14', 18500, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-560-mad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Ride — Nero Rosso Opaco', '560G-ALV-03', 19500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-560-mad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Ride — Grafite Giallo Fluo Opaco', '560G-ALV-19', 19500, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-560-mad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 568 BER  (helmets, 8 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-568-ber', 'CGM 568 BER', 'helmets', 'CGM', 'CGM', 'CGM 568 Ber modular helmet — CGM Italia flip-up on a terpolymer shell with a drop-down sun visor, Pinlock 70-ready. Eight colourways.', 'The CGM 568 Ber is a mid-range modular from CGM Italia — a terpolymer-shell flip-up with an internal sun visor and a clear outer visor pinned for a Pinlock 70 anti-fog lens (optional). Full-face protection with open-face convenience at the lights. Built to European ECE standards.

Eight finishes across the Mono, Dresda and Sport lines. Colourways and part numbers are listed on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Modular (flip-up)"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '568A-ALV-01', 11250, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Blu Satinato', '568A-ALV-06', 11250, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Grafite Opaco', '568A-ALV-09', 11250, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '568A-ALV-14', 11250, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Dresda — Nero Rosso Opaco', '568G-ALV-03', 11750, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Dresda — Grafite Giallo Fluo Opaco', '568G-ALV-19', 11750, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Bianco Blu', '568S-ALV-79', 11750, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Fucsia Fluo', '568S-ALV-83', 11750, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-568-ber'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 569 C-MAX  (helmets, 10 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-569-c-max', 'CGM 569 C-MAX', 'helmets', 'CGM', 'CGM', 'CGM 569 C-Max modular helmet — CGM Italia flip-up, terpolymer shell, drop-down sun visor, Pinlock 70-ready. Ten colourways.', 'The CGM 569 C-Max is CGM Italia''s everyday modular (flip-up) helmet — a terpolymer shell, an internal drop-down sun visor and a clear visor pinned for a Pinlock 70 anti-fog lens (optional). A practical touring and commuting lid. ECE-standard European build.

Ten finishes across the C-Max Mono and C-Max City lines — see the table below for every colourway and part number.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Modular (flip-up)"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '569A-ALV-01', 10250, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero', '569A-ALV-83', 10250, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '569A-ALV-14', 10250, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Antracite Satinato', '569A-ALV-10', 10250, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Blu Satinato', '569A-ALV-06', 10250, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Nero Fucsia Fluo Opaco', '569G-ALV-20', 11250, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Nero Giallo Fluo Opaco', '569G-ALV-19', 11250, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Blu Bianco Rosso', '569G-ALV-79', 11250, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Grafite Nero', '569G-ALV-88', 11250, null, true, 0, 8, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Nero Rosso Opaco', '569G-ALV-03', 11250, null, true, 0, 9, true
from public.streetproculture_products where slug = 'cgm-569-c-max'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 160 JAD  (helmets, 5 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-160-jad', 'CGM 160 JAD', 'helmets', 'CGM', 'CGM', 'CGM 160 Jad jet helmet — CGM Italia fibreglass open-face with a clear visor, Pinlock 70-ready. Five finishes.', 'The CGM 160 Jad is a premium jet (open-face) helmet from CGM Italia on a fibreglass shell, with a clear flip-down visor pinned for a Pinlock 70 anti-fog lens (optional). The classic three-quarter shape with a proper Italian build. ECE-standard.

Five finishes across the Jad Mono and Jad Ride lines — Nero Opaco, Blu Satinato, Bianco, Nero Rosso Opaco and Grafite Giallo Fluo Opaco.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Jet / open-face"},{"label":"Shell","value":"Fibreglass"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '160A-ALV-01', 13250, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-160-jad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Blu Satinato', '160A-ALV-06', 13250, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-160-jad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '160A-ALV-14', 13250, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-160-jad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Ride — Nero Rosso Opaco', '160G-ALV-03', 14000, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-160-jad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Ride — Grafite Giallo Fluo Opaco', '160G-ALV-19', 14000, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-160-jad'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 136 RNA  (helmets, 13 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-136-rna', 'CGM 136 RNA', 'helmets', 'CGM', 'CGM', 'CGM 136 RNA jet helmet — CGM Italia open-face in carbon or terpolymer, Pinlock 70 lens included. 13 finishes.', 'The CGM 136 RNA is CGM Italia''s jet (open-face) helmet, offered in two builds: a carbon-fibre shell for the RNA Pro and Pro Street lines, and a high-performance terpolymer shell for the Mono, Race and Sport lines. Every version ships with a Pinlock 70 anti-fog lens and meets European ECE standards.

13 finishes in total. Shell material, colourway and part number for each are listed on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Jet / open-face"},{"label":"Shell","value":"Carbon / High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 lens included"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Pro — Carbon Nero Opaco', '136C-BLV-01', 18000, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Pro — Carbon Nero', '136C-BLV-83', 18000, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Pro Street — Carbon Giallo Fluo Opaco', '136X-BLV-19', 18500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '136A-BLV-01', 7750, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Blu Satinato', '136A-BLV-06', 7750, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Antracite Satinato', '136A-BLV-10', 7750, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '136A-BLV-14', 7750, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Race — Grigio Rosso Opaco', '136S-BLV-03', 8500, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Race — Blu Giallo Fluo', '136S-BLV-79', 8500, null, true, 0, 8, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Grigio Rosso Opaco', '136G-BLV-03', 8500, null, true, 0, 9, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Grigio Giallo Fluo Opaco', '136G-BLV-19', 8500, null, true, 0, 10, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Rosso Blu', '136G-BLV-85', 8500, null, true, 0, 11, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Giallo Fluo', '136G-BLV-93', 8500, null, true, 0, 12, true
from public.streetproculture_products where slug = 'cgm-136-rna'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 127 DEEP  (helmets, 10 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-127-deep', 'CGM 127 DEEP', 'helmets', 'CGM', 'CGM', 'CGM 127 Deep jet helmet — CGM Italia open-face, terpolymer shell, clear visor, Pinlock 70-ready. Ten finishes.', 'The CGM 127 Deep is a jet (open-face) helmet from CGM Italia on a terpolymer shell, with a clear flip visor pinned for a Pinlock 70 anti-fog lens (optional). A clean, city-friendly three-quarter lid. Built to European ECE standards.

Ten finishes across the Mono, Race, Rune and Freaker lines — colourways and part numbers below.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Jet / open-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '127A-ALV-01', 8000, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Verde Opaco', '127A-ALV-07', 8000, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '127A-ALV-14', 8000, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Petrolio Satinato', '127A-ALV-28', 8000, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Grigio', '127A-ALV-78', 8000, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Race — Grafite Rosso Opaco', '127G-ALV-03', 8750, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Race — Grafite Giallo Fluo Opaco', '127G-ALV-19', 8750, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Rune — Nero Grafite Opaco', '127S-ALV-09', 8750, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Freaker — Nero Rosso Opaco', '127X-ALV-03', 8750, null, true, 0, 8, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Freaker — Nero Giallo Fluo', '127X-ALV-93', 8750, null, true, 0, 9, true
from public.streetproculture_products where slug = 'cgm-127-deep'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 116 AIR  (helmets, 6 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-116-air', 'CGM 116 AIR', 'helmets', 'CGM', 'CGM', 'CGM 116 Air jet helmet — CGM Italia''s lightweight open-face on a terpolymer shell with a clear visor. Six finishes.', 'The CGM 116 Air is CGM Italia''s light, no-fuss jet (open-face) helmet — a terpolymer shell and a clear flip visor, made for short city hops and scooter riders. ECE-standard European build.

Six finishes across the Air Mono and Air Bico lines — Nero Opaco, Verde Opaco, Bianco, Bigio, Grafite Giallo Fluo Opaco and Bianco Blu.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Jet / open-face"},{"label":"Shell","value":"High-Performance Terpolymer"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '116A-ALV-01', 6500, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-116-air'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Verde Opaco', '116A-ALV-07', 6500, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-116-air'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '116A-ALV-14', 6500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-116-air'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bigio', '116A-ALV-66', 6500, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-116-air'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bico — Grafite Giallo Fluo Opaco', '116G-ALV-19', 7000, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-116-air'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bico — Bianco Blu', '116G-ALV-79', 7000, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-116-air'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 167 FLO  (helmets, 34 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-167-flo', 'CGM 167 FLO', 'helmets', 'CGM', 'CGM', 'CGM 167 Flo jet helmet — CGM Italia open-face with a choice of long or shape visor. 34 colourway and visor combinations.', 'The CGM 167 Flo is CGM Italia''s most-configurable jet (open-face) helmet — a terpolymer shell offered with two visor profiles: the Long visor for maximum coverage, or the shorter Shape visor for a retro cut. Built to European ECE standards.

Six style lines — Mono, City, Bico, Joy, Sport and Dot — across a wide colour range, each available with either visor, for 34 combinations in all. Pick your exact colourway and visor from the table below; each has its own part number.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Jet / open-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Visor","value":"Long-visor & Shape-visor options"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco (Long Visor)', '167A-ALA-01', 5750, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Verde Opaco (Long Visor)', '167A-ALA-07', 5750, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Antracite Satinato (Long Visor)', '167A-ALA-10', 5750, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Tortora Satinato (Long Visor)', '167A-ALA-11', 5750, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco (Long Visor)', '167A-ALA-14', 5750, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Viola Opaco (Long Visor)', '167A-ALA-16', 5750, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Petrolio Satinato (Long Visor)', '167A-ALA-28', 5750, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bigio (Long Visor)', '167A-ALA-66', 5750, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero (Long Visor)', '167A-ALA-83', 5750, null, true, 0, 8, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Nero Rosso Opaco (Long Visor)', '167K-ALA-03', 6500, null, true, 0, 9, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Nero Giallo Fluo Opaco (Long Visor)', '167K-ALA-19', 6500, null, true, 0, 10, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bico — Bianco Grigio (Long Visor)', '167L-ALA-78', 6500, null, true, 0, 11, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bico — Bianco Blu (Long Visor)', '167L-ALA-79', 6500, null, true, 0, 12, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Joy — Nero Azzurro Verde Opaco (Long Visor)', '167S-ALA-01', 6500, null, true, 0, 13, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Blu Bianco Rosso (Long Visor)', '167D-ALA-85', 6500, null, true, 0, 14, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Dot — Nero Arancione Fluo Opaco (Long Visor)', '167M-ALA-17', 6500, null, true, 0, 15, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Dot — Nero Fucsia Fluo Opaco (Long Visor)', '167M-ALA-20', 6500, null, true, 0, 16, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco (Shape Visor)', '167A-ASA-01', 5750, null, true, 0, 17, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Verde Opaco (Shape Visor)', '167A-ASA-07', 5750, null, true, 0, 18, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Antracite Satinato (Shape Visor)', '167A-ASA-10', 5750, null, true, 0, 19, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Tortora Satinato (Shape Visor)', '167A-ASA-11', 5750, null, true, 0, 20, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco (Shape Visor)', '167A-ASA-14', 5750, null, true, 0, 21, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Viola Opaco (Shape Visor)', '167A-ASA-16', 5750, null, true, 0, 22, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Petrolio Satinato (Shape Visor)', '167A-ASA-28', 5750, null, true, 0, 23, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bigio (Shape Visor)', '167A-ASA-66', 5750, null, true, 0, 24, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero (Shape Visor)', '167A-ASA-83', 5750, null, true, 0, 25, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Nero Rosso Opaco (Shape Visor)', '167K-ASA-03', 6500, null, true, 0, 26, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'City — Nero Giallo Fluo Opaco (Shape Visor)', '167K-ASA-19', 6500, null, true, 0, 27, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bico — Bianco Grigio (Shape Visor)', '167L-ASA-78', 6500, null, true, 0, 28, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Bico — Bianco Blu (Shape Visor)', '167L-ASA-79', 6500, null, true, 0, 29, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Joy — Nero Azzurro Verde Opaco (Shape Visor)', '167S-ASA-01', 6500, null, true, 0, 30, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Blu Bianco Rosso (Shape Visor)', '167D-ASA-85', 6500, null, true, 0, 31, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Dot — Nero Arancione Fluo Opaco (Shape Visor)', '167M-ASA-17', 6500, null, true, 0, 32, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Dot — Nero Fucsia Fluo Opaco (Shape Visor)', '167M-ASA-20', 6500, null, true, 0, 33, true
from public.streetproculture_products where slug = 'cgm-167-flo'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 191 PIX  (helmets, 18 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-191-pix', 'CGM 191 PIX', 'helmets', 'CGM', 'CGM', 'CGM 191 Pix jet helmet — compact CGM Italia open-face with long- or shape-visor options. 18 combinations.', 'The CGM 191 Pix is a compact jet (open-face) helmet from CGM Italia — a terpolymer shell with a slim profile, offered with a Long visor or a shorter Shape visor. ECE-standard European build.

Style lines Mono, Sprint, It and Vintage across several colourways, each with a choice of visor — 18 combinations. Colourways, visor type and part numbers are on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Jet / open-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Visor","value":"Long-visor & Shape-visor options"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco (Long Visor)', '191A-ALA-01', 5500, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco (Long Visor)', '191A-ALA-14', 5500, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Grigio (Long Visor)', '191A-ALA-78', 5500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sprint — Celeste Arancione Opaco (Long Visor)', '191G-ALA-26', 6750, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sprint — Rosso Bianco (Long Visor)', '191G-ALA-85', 6750, null, true, 0, 4, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sprint — Viola Fucsia Fluo (Long Visor)', '191G-ALA-95', 6750, null, true, 0, 5, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'It — Verde Bianco Rosso (Long Visor)', '191I-ALA-14', 6750, null, true, 0, 6, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Vintage — Blu Argento Satinato (Long Visor)', '191V-ALA-06', 6750, null, true, 0, 7, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Vintage — Bianco Bordeaux (Long Visor)', '191V-ALA-14', 6750, null, true, 0, 8, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco (Shape Visor)', '191A-ASA-01', 5500, null, true, 0, 9, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco (Shape Visor)', '191A-ASA-14', 5500, null, true, 0, 10, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Grigio (Shape Visor)', '191A-ASA-78', 5500, null, true, 0, 11, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sprint — Celeste Arancione Opaco (Shape Visor)', '191G-ASA-26', 6750, null, true, 0, 12, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sprint — Rosso Bianco (Shape Visor)', '191G-ASA-85', 6750, null, true, 0, 13, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sprint — Viola Fucsia Fluo (Shape Visor)', '191G-ASA-95', 6750, null, true, 0, 14, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'It — Verde Bianco Rosso (Shape Visor)', '191I-ASA-14', 6750, null, true, 0, 15, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Vintage — Blu Argento Satinato (Shape Visor)', '191V-ASA-06', 6750, null, true, 0, 16, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Vintage — Bianco Bordeaux (Shape Visor)', '191V-ASA-14', 6750, null, true, 0, 17, true
from public.streetproculture_products where slug = 'cgm-191-pix'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- SKAP 3MH SPEEDER  (helmets, 6 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('skap-3mh-speeder', 'SKAP 3MH SPEEDER', 'helmets', 'SKAP', 'SKAP', 'SKAP 3MH Speeder full-face helmet — value line from CGM Italia, terpolymer shell, Pinlock 70-ready visor. Six graphics.', 'The SKAP 3MH Speeder is a full-face helmet from SKAP, CGM Italia''s value brand — a terpolymer shell and a clear visor pinned for a Pinlock 70 anti-fog lens (optional), at a keen price. Built to European ECE standards.

Six finishes across the Speeder Mono, Sport and Rainbow lines. Colourways and part numbers below.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Full-face"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '3MHA-ALV-01', 5750, null, true, 0, 0, true
from public.streetproculture_products where slug = 'skap-3mh-speeder'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '3MHA-ALV-14', 5750, null, true, 0, 1, true
from public.streetproculture_products where slug = 'skap-3mh-speeder'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Giallo Fluo Opaco', '3MHG-ALV-19', 6250, null, true, 0, 2, true
from public.streetproculture_products where slug = 'skap-3mh-speeder'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Grigio Rosso', '3MHG-ALV-85', 6250, null, true, 0, 3, true
from public.streetproculture_products where slug = 'skap-3mh-speeder'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Blu Giallo Fluo', '3MHG-ALV-93', 6250, null, true, 0, 4, true
from public.streetproculture_products where slug = 'skap-3mh-speeder'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Rainbow — Nero Verde Rosso Opaco', '3MHS-ALV-01', 6250, null, true, 0, 5, true
from public.streetproculture_products where slug = 'skap-3mh-speeder'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- SKAP 5TH FALCON  (helmets, 4 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('skap-5th-falcon', 'SKAP 5TH FALCON', 'helmets', 'SKAP', 'SKAP', 'SKAP 5TH Falcon modular helmet — flip-up from CGM Italia''s value line, terpolymer shell, Pinlock 70-ready. Four finishes.', 'The SKAP 5TH Falcon is a modular (flip-up) helmet from SKAP, CGM Italia''s value brand — a terpolymer-shell flip-up with a clear visor pinned for a Pinlock 70 anti-fog lens (optional). Full-face and open-face in one, at an entry price. ECE-standard.

Four finishes across the Falcon Mono and Sport lines — Nero Opaco, Antracite Satinato, Bianco and Nero Giallo Fluo Opaco.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Modular (flip-up)"},{"label":"Shell","value":"High-Performance Terpolymer"},{"label":"Pinlock","value":"Pinlock 70 ready — lens DKS002CGMCL (optional)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '5THA-ALV-01', 8500, null, true, 0, 0, true
from public.streetproculture_products where slug = 'skap-5th-falcon'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Antracite Satinato', '5THA-ALV-10', 8500, null, true, 0, 1, true
from public.streetproculture_products where slug = 'skap-5th-falcon'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '5THA-ALV-14', 8500, null, true, 0, 2, true
from public.streetproculture_products where slug = 'skap-5th-falcon'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Nero Giallo Fluo Opaco', '5THG-ALV-19', 9000, null, true, 0, 3, true
from public.streetproculture_products where slug = 'skap-5th-falcon'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- SKAP 1LH LUKE  (helmets, 6 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('skap-1lh-luke', 'SKAP 1LH LUKE', 'helmets', 'SKAP', 'SKAP', 'SKAP 1LH Luke jet helmet — affordable open-face from CGM Italia''s value line, terpolymer shell. Six finishes.', 'The SKAP 1LH Luke is a jet (open-face) helmet from SKAP, CGM Italia''s value brand — a simple terpolymer-shell three-quarter lid for city riding and scooters, at the sharp end of the range. Built to European ECE standards.

Six finishes across the Luke Mono and Sport lines — colourways and part numbers on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Jet / open-face"},{"label":"Shell","value":"High-Performance Terpolymer"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero Opaco', '1LHA-BLA-01', 3750, null, true, 0, 0, true
from public.streetproculture_products where slug = 'skap-1lh-luke'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Antracite Satinato', '1LHA-BLA-10', 3750, null, true, 0, 1, true
from public.streetproculture_products where slug = 'skap-1lh-luke'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Bianco', '1LHA-BLA-14', 3750, null, true, 0, 2, true
from public.streetproculture_products where slug = 'skap-1lh-luke'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Rosa Fluo Opaco', '1LHA-BLA-24', 3750, null, true, 0, 3, true
from public.streetproculture_products where slug = 'skap-1lh-luke'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Mono — Nero', '1LHA-BLA-83', 3750, null, true, 0, 4, true
from public.streetproculture_products where slug = 'skap-1lh-luke'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Sport — Antracite Giallo Fluo Satinato', '1LHG-BLA-19', 4500, null, true, 0, 5, true
from public.streetproculture_products where slug = 'skap-1lh-luke'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- X-Land Top Case Back Cushion  (parts, 1 variant)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('x-land-top-case-back-cushion', 'X-Land Top Case Back Cushion', 'parts', 'X-LAND', 'X-Land', 'X-Land top case back cushion — a padded backrest that fixes inside the lid so a pillion has something to lean on. In stock at Street Pro Culture, Manila.', 'A padded backrest pad for X-Land aluminium top cases. It attaches to the inside of the case lid and gives a pillion passenger a comfortable place to rest against on longer rides.

Fits the X-Land H, M and Y-Series cases.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Padded backrest"},{"label":"Fits","value":"X-Land H / M / Y-Series aluminium top cases"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Default', 'BC', 375, null, true, 0, 0, true
from public.streetproculture_products where slug = 'x-land-top-case-back-cushion'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- NZI Fibra Clear Visor  (parts, 4 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('nzi-fibra-clear-visor', 'NZI Fibra Clear Visor', 'parts', 'NZI', 'NZI', 'Genuine NZI Fibra replacement visor — a clear outer visor, one to match each helmet model. In stock at Street Pro Culture, Manila.', 'A factory replacement clear outer visor for NZI Fibra Atto Duo, Exa Duo, Giga and Byte Stream helmets. There''s a specific visor for each model — Atto Duo, Exa Duo, Giga and Byte Stream — so pick the one that matches your helmet from the list below.

It clips on with the helmet''s own visor mechanism, no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"NZI Fibra Atto Duo, Exa Duo, Giga and Byte Stream helmets"},{"label":"Tints","value":"Clear"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Atto Duo', '060762G004', 750, null, true, 0, 0, true
from public.streetproculture_products where slug = 'nzi-fibra-clear-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Exa Duo', '060824G000', 750, null, true, 0, 1, true
from public.streetproculture_products where slug = 'nzi-fibra-clear-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Giga', '060696G705', 550, null, true, 0, 2, true
from public.streetproculture_products where slug = 'nzi-fibra-clear-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Byte Stream', '060762G026', 550, null, true, 0, 3, true
from public.streetproculture_products where slug = 'nzi-fibra-clear-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM Pinlock 70 Anti-Fog Lens  (parts, 3 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-pinlock-70-lens', 'CGM Pinlock 70 Anti-Fog Lens', 'parts', 'CGM', 'CGM', 'Genuine CGM Pinlock 70 anti-fog lens — clips inside a Pinlock-ready visor to stop it misting up. In stock at Street Pro Culture, Manila.', 'The Pinlock 70 lens is a thin inner shield that snaps onto the pins inside a Pinlock-ready visor and seals against it, forming a double-glazed pane that stays clear in cold and wet weather.

Pick the lens that matches your helmet — most CGM and SKAP models take the standard DKS002CGMCL; the 361 Avent Pro and 560 Mad use their own. Your helmet''s spec sheet says which, and each part number is listed on this page.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Pinlock 70 anti-fog visor insert"},{"label":"Fits","value":"CGM & SKAP helmets marked Pinlock-70 ready (see the helmet''s spec sheet)"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Standard fit — most CGM & SKAP helmets', 'DKS002CGMCL', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-pinlock-70-lens'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '361 Avent Pro', 'DKS442', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-pinlock-70-lens'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, '560 Mad', 'DKS413', 2100, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-pinlock-70-lens'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM Fog City Anti-Fog Insert  (parts, 1 variant)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-fog-city-insert', 'CGM Fog City Anti-Fog Insert', 'parts', 'CGM', 'CGM', 'CGM Fog City anti-fog insert for the CGM 311 Blast — a stick-on inner film that keeps the visor clear in cold and wet weather. In stock at Street Pro Culture, Manila.', 'The Fog City insert is a self-adhesive anti-fog film that presses onto the inside of the visor. It''s the anti-fog fix for the CGM 311 Blast, which isn''t cut for a Pinlock lens.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Stick-on anti-fog insert"},{"label":"Fits","value":"CGM 311 Blast"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Default', 'FCG001', 1650, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-fog-city-insert'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 361 Avent Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-361-avent-visor', 'CGM 361 Avent Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 361 Avent, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 361 Avent, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 361 Avent helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9361-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-361-avent-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9361-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-361-avent-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 363 Shot Visor  (parts, 3 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-363-shot-visor', 'CGM 363 Shot Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 363 Shot, available in clear, smoke 50%, and iridium mirror. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 363 Shot, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding, smoke 50% for bright days, or an iridium mirror finish that cuts glare hardest. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 363 Shot helmet"},{"label":"Tints","value":"Clear, Smoke 50%, Iridium mirror"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9363-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-363-shot-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9363-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-363-shot-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Iridium mirror', '9363-AL4-00P Visor Iridium', 2400, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-363-shot-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 333 Onyx Visor  (parts, 3 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-333-onyx-visor', 'CGM 333 Onyx Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 333 Onyx, available in clear, smoke 50%, and iridium mirror. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 333 Onyx, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding, smoke 50% for bright days, or an iridium mirror finish that cuts glare hardest. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 333 Onyx helmet"},{"label":"Tints","value":"Clear, Smoke 50%, Iridium mirror"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9333-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-333-onyx-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9333-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-333-onyx-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Iridium mirror', '9333-AL4-00P Visor Iridium', 2400, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-333-onyx-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 311 Blast Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-311-blast-visor', 'CGM 311 Blast Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 311 Blast, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 311 Blast, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 311 Blast helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9311-AL1-00F Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-311-blast-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9311-AL2-00F Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-311-blast-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 330 Riot Visor  (parts, 3 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-330-riot-visor', 'CGM 330 Riot Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 330 Riot, available in clear, smoke 50%, and iridium mirror. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 330 Riot, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding, smoke 50% for bright days, or an iridium mirror finish that cuts glare hardest. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 330 Riot helmet"},{"label":"Tints","value":"Clear, Smoke 50%, Iridium mirror"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9330-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-330-riot-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9330-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-330-riot-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Iridium mirror', '9330-AL4-00P Visor Iridium', 2400, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-330-riot-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 560 Mad Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-560-mad-visor', 'CGM 560 Mad Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 560 Mad, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 560 Mad, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 560 Mad helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9560-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-560-mad-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9560-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-560-mad-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 568 Ber Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-568-ber-visor', 'CGM 568 Ber Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 568 Ber, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 568 Ber, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 568 Ber helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9568-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-568-ber-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9568-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-568-ber-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 569 C-Max Visor  (parts, 3 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-569-c-max-visor', 'CGM 569 C-Max Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 569 C-Max, available in clear, smoke 50%, and iridium mirror. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 569 C-Max, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding, smoke 50% for bright days, or an iridium mirror finish that cuts glare hardest. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 569 C-Max helmet"},{"label":"Tints","value":"Clear, Smoke 50%, Iridium mirror"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9569-AL1-00Z Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-569-c-max-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9569-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-569-c-max-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Iridium mirror', '9569-AL4-00P Visor Iridium', 2400, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-569-c-max-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 160 Jad Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-160-jad-visor', 'CGM 160 Jad Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 160 Jad, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 160 Jad, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 160 Jad helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9160-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-160-jad-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9160-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-160-jad-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 136 Rna Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-136-rna-visor', 'CGM 136 Rna Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 136 Rna, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 136 Rna, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 136 Rna helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9136-BL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-136-rna-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9136-BL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-136-rna-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 127 Deep Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-127-deep-visor', 'CGM 127 Deep Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 127 Deep, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 127 Deep, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 127 Deep helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9127-AL1-00P Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-127-deep-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '9127-AL2-00P Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-127-deep-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 126 Visor  (parts, 1 variant)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-126-visor', 'CGM 126 Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 126, available in clear. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 126, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 126 helmet"},{"label":"Tints","value":"Clear"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9126-AL1-00Z Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-126-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 116 Air Visor  (parts, 1 variant)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-116-air-visor', 'CGM 116 Air Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 116 Air, available in clear. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 116 Air, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 116 Air helmet"},{"label":"Tints","value":"Clear"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '9116-AL1-00Z Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-116-air-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 167 Flo Visor  (parts, 4 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-167-flo-visor', 'CGM 167 Flo Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 167 Flo, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 167 Flo, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It comes in long visor and shape visor profiles — order the one your helmet shipped with. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 167 Flo helmet"},{"label":"Tints","value":"Clear, Smoke 50%"},{"label":"Visor profile","value":"Long visor, Shape visor"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear — Long visor', '9167-AL1-00Z Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-167-flo-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50% — Long visor', '9167-AL2-00Z Smoke 50%', 2100, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-167-flo-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear — Shape visor', '9167-AS1-00Z Transparent', 1800, null, true, 0, 2, true
from public.streetproculture_products where slug = 'cgm-167-flo-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50% — Shape visor', '9167-AS2-00Z Smoke 50%', 2100, null, true, 0, 3, true
from public.streetproculture_products where slug = 'cgm-167-flo-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- CGM 191 Pix Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('cgm-191-pix-visor', 'CGM 191 Pix Visor', 'parts', 'CGM', 'CGM', 'Genuine replacement visor for the CGM 191 Pix, available in clear. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the CGM 191 Pix, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding. It comes in long visor and shape visor profiles — order the one your helmet shipped with. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"CGM 191 Pix helmet"},{"label":"Tints","value":"Clear"},{"label":"Visor profile","value":"Long visor, Shape visor"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear — Long visor', '9191-AL1-00Z Transparent', 1800, null, true, 0, 0, true
from public.streetproculture_products where slug = 'cgm-191-pix-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear — Shape visor', '9191-AS1-00Z Transparent', 1800, null, true, 0, 1, true
from public.streetproculture_products where slug = 'cgm-191-pix-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- SKAP 3MH Speeder Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('skap-3mh-speeder-visor', 'SKAP 3MH Speeder Visor', 'parts', 'SKAP', 'SKAP', 'Genuine replacement visor for the SKAP 3MH Speeder, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the SKAP 3MH Speeder, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"SKAP 3MH Speeder helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '93MH-AL1-00P Transparent', 1700, null, true, 0, 0, true
from public.streetproculture_products where slug = 'skap-3mh-speeder-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '93MH-AL2-00P Smoke 50%', 1900, null, true, 0, 1, true
from public.streetproculture_products where slug = 'skap-3mh-speeder-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- SKAP 5TH Falcon Visor  (parts, 1 variant)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('skap-5th-falcon-visor', 'SKAP 5TH Falcon Visor', 'parts', 'SKAP', 'SKAP', 'Genuine replacement visor for the SKAP 5TH Falcon, available in clear. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the SKAP 5TH Falcon, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"SKAP 5TH Falcon helmet"},{"label":"Tints","value":"Clear"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '95TH-AL1-00P Transparent', 1700, null, true, 0, 0, true
from public.streetproculture_products where slug = 'skap-5th-falcon-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

-- ======================================================================
-- SKAP 1LH Luke Visor  (parts, 2 variants)
-- ======================================================================
insert into public.streetproculture_products
  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)
values ('skap-1lh-luke-visor', 'SKAP 1LH Luke Visor', 'parts', 'SKAP', 'SKAP', 'Genuine replacement visor for the SKAP 1LH Luke, available in clear and smoke 50%. In stock at Street Pro Culture, Manila.', 'A factory replacement outer visor for the SKAP 1LH Luke, so a scratched, cracked or hazed visor never keeps you off the bike. Choose clear for everyday and night riding or smoke 50% for bright days. It swaps on using the helmet''s own visor mechanism — no tools.

Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.', '[{"label":"Type","value":"Replacement outer visor"},{"label":"Fits","value":"SKAP 1LH Luke helmet"},{"label":"Tints","value":"Clear, Smoke 50%"}]'::jsonb, false, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, tag = excluded.tag,
  brand = excluded.brand, blurb = excluded.blurb,
  description = excluded.description, specs = excluded.specs;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Clear', '91LH-BL1-00Z Transparent', 1700, null, true, 0, 0, true
from public.streetproculture_products where slug = 'skap-1lh-luke-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

insert into public.streetproculture_product_variants
  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)
select id, 'Smoke 50%', '91LH-BL2-00Z Smoke 50%', 1900, null, true, 0, 1, true
from public.streetproculture_products where slug = 'skap-1lh-luke-visor'
on conflict (product_id, label) do update set
  sku = excluded.sku, price = excluded.price, position = excluded.position;

commit;
