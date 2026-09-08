-- Push every "parts" product below the helmets and cases on /shop.
--
-- The shop lists products by created_at ascending. A bulk catalog.sql run gives
-- every row the same timestamp, so parts end up scattered. This stamps parts
-- with far-future dates (and a stable A–Z order among themselves) so they always
-- sort last. Non-parts rows are untouched. Safe to re-run.
--
-- Survives a `catalog.sql` re-run (that never writes created_at). After a
-- `reset.sql`, re-run this too.
--
-- The storefront caches the product list — after running this, trigger a refresh
-- (toggle any product's "Live" off/on in /admin, or redeploy).

begin;

update public.streetproculture_products p
   set created_at =
         timestamptz '2099-01-01 00:00:00+00'
         + (ord.rn - 1) * interval '1 minute'
  from (
    select id, row_number() over (order by name) as rn
      from public.streetproculture_products
     where category = 'parts'
  ) ord
 where p.id = ord.id;

commit;
