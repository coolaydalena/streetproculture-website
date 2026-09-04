-- Street Pro Culture — optional map pin for delivery orders.
--
-- The customer can drop a pin on a map at checkout so the courier has exact
-- coordinates alongside the typed address. Nullable — pinning is optional, and
-- pickup orders never set it.

alter table public.streetproculture_orders
  add column delivery_lat numeric(9, 6)
    check (delivery_lat is null or (delivery_lat >= -90 and delivery_lat <= 90)),
  add column delivery_lng numeric(9, 6)
    check (delivery_lng is null or (delivery_lng >= -180 and delivery_lng <= 180));
