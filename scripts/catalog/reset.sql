-- Delete every Street Pro Culture product. Run this before catalog.sql for a
-- fully clean reload (removes products renamed/dropped upstream).
--
-- Cascades: streetproculture_product_variants and streetproculture_product_images
-- rows are removed (ON DELETE CASCADE). streetproculture_order_items keeps its
-- snapshots — product_id / variant_id just go NULL (ON DELETE SET NULL), so past
-- orders are unaffected. Uploaded storage objects (if any) are NOT touched.

begin;
delete from public.streetproculture_products;
commit;
