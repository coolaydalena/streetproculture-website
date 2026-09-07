-- Street Pro Culture — order items carry a variant snapshot.
--
-- Line items now reference the purchased variant and snapshot its label (like
-- product_name / product_slug already do). Stock is decremented against the
-- variant, not the product.

alter table public.streetproculture_order_items
  add column variant_id uuid
    references public.streetproculture_product_variants (id) on delete set null,
  add column variant_label text;

-- Existing rows predate variants: use the product name as the label.
update public.streetproculture_order_items
   set variant_label = product_name
 where variant_label is null;

-- ---------------------------------------------------------------------------
-- Stock decrement now targets the variant.
--   items: [{ "variant_id": "<uuid>", "qty": <int> }, ...]
-- ---------------------------------------------------------------------------
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
    select (e ->> 'variant_id')::uuid as vid, (e ->> 'qty')::int as qty
      from jsonb_array_elements(items) e
  loop
    update public.streetproculture_product_variants
       set stock_quantity = stock_quantity - rec.qty
     where id = rec.vid
       and track_inventory
       and stock_quantity is not null
       and stock_quantity >= rec.qty;

    get diagnostics updated = row_count;

    if updated = 0 and exists (
      select 1 from public.streetproculture_product_variants
       where id = rec.vid and track_inventory
    ) then
      -- Tracked variant that couldn't absorb the full quantity: clamp to 0 and
      -- record the shortfall.
      update public.streetproculture_product_variants
         set stock_quantity = 0
       where id = rec.vid and track_inventory and stock_quantity is not null
         and stock_quantity < rec.qty;
      shortfalls := shortfalls || jsonb_build_object('variant_id', rec.vid, 'qty', rec.qty);
    end if;
  end loop;

  return shortfalls;
end;
$$;

revoke all on function public.streetproculture_decrement_stock(jsonb) from public;
grant execute on function public.streetproculture_decrement_stock(jsonb) to service_role;
