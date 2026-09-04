-- Street Pro Culture — Phase 2 stock decrement.
--
-- Stock is deducted once, when an order becomes `paid` (PayMongo webhook, or an
-- admin marking a pay-at-shop order collected). Guarded so it never drives a
-- tracked product negative; untracked products are ignored. Returns a jsonb
-- array of shortfalls (empty when everything applied cleanly) for logging.
--
-- items: [{ "product_id": "<uuid>", "qty": <int> }, ...]

create or replace function public.streetproculture_decrement_stock(items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec        record;
  updated    integer;
  shortfalls jsonb := '[]'::jsonb;
begin
  for rec in
    select (e ->> 'product_id')::uuid as pid, (e ->> 'qty')::int as qty
      from jsonb_array_elements(items) e
  loop
    update public.streetproculture_products
       set stock_quantity = stock_quantity - rec.qty
     where id = rec.pid
       and track_inventory
       and stock_quantity is not null
       and stock_quantity >= rec.qty;

    get diagnostics updated = row_count;

    if updated = 0 and exists (
      select 1 from public.streetproculture_products
       where id = rec.pid and track_inventory
    ) then
      -- Tracked product that couldn't absorb the full quantity: clamp to 0 and
      -- record the shortfall.
      update public.streetproculture_products
         set stock_quantity = 0
       where id = rec.pid and track_inventory and stock_quantity is not null
         and stock_quantity < rec.qty;
      shortfalls := shortfalls || jsonb_build_object('product_id', rec.pid, 'qty', rec.qty);
    end if;
  end loop;

  return shortfalls;
end;
$$;

revoke all on function public.streetproculture_decrement_stock(jsonb) from public;
grant execute on function public.streetproculture_decrement_stock(jsonb) to service_role;
