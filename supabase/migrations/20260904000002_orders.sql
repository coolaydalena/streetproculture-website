-- Street Pro Culture — Phase 2 orders.
--
--   * streetproculture_orders        one row per checkout
--   * streetproculture_order_items   line items, snapshotted at purchase time
--
-- Money is stored in integer centavos (PHP). Product prices are whole pesos and
-- are multiplied by 100 when snapshotted onto an order item.
--
-- Writes NEVER go through the anon/authenticated API — the checkout server
-- action and the PayMongo webhook use the service-role client, which bypasses
-- RLS. All correctness (price recompute, ownership, allowed status transitions)
-- lives in that server code. RLS here only governs READS, plus the superadmin
-- status-update path from /admin/orders.

create sequence public.streetproculture_order_number_seq start 1001;

create table public.streetproculture_orders (
  id                             uuid primary key default gen_random_uuid(),
  order_number                   text not null unique,
  -- Unguessable capability token for guest order tracking (/orders/<token>).
  public_token                   uuid not null default gen_random_uuid(),
  user_id                        uuid references auth.users (id) on delete set null,

  status                         text not null default 'pending_payment'
                                   check (status in (
                                     'pending_payment', 'pending_pay_at_shop', 'paid',
                                     'preparing', 'ready_for_pickup', 'out_for_delivery',
                                     'completed', 'cancelled', 'expired')),
  fulfilment                     text not null
                                   check (fulfilment in ('pickup', 'delivery')),
  payment_method                 text not null
                                   check (payment_method in (
                                     'card', 'gcash', 'paymaya', 'grab_pay', 'qrph', 'pay_at_shop')),

  customer_name                  text not null,
  customer_email                 text not null,
  customer_phone                 text not null,
  delivery_address               text,
  delivery_city                  text,
  pickup_notes                   text,

  -- Money — all integer centavos, PHP.
  subtotal_centavos              integer not null check (subtotal_centavos >= 0),
  own_fee_centavos               integer not null default 0 check (own_fee_centavos >= 0),
  paymongo_fee_centavos          integer not null default 0 check (paymongo_fee_centavos >= 0),
  delivery_fee_centavos          integer not null default 0 check (delivery_fee_centavos >= 0),
  service_fee_centavos           integer not null default 0 check (service_fee_centavos >= 0),
  total_centavos                 integer not null check (total_centavos >= 0),
  -- Actual PayMongo fee, filled from the webhook, for admin reconciliation.
  paymongo_fee_actual_centavos   integer check (paymongo_fee_actual_centavos >= 0),

  -- Fee config in effect at checkout — so a later settings change never
  -- rewrites this order's history.
  settings_snapshot              jsonb not null default '{}'::jsonb,

  paymongo_checkout_session_id   text,
  paymongo_checkout_url          text,
  paymongo_payment_id            text,
  paid_at                        timestamptz,
  payment_failed_at              timestamptz,
  expires_at                     timestamptz,

  status_changed_at              timestamptz not null default now(),
  admin_notes                    text,
  cancelled_reason               text,

  created_at                     timestamptz not null default now(),
  updated_at                     timestamptz not null default now(),

  constraint streetproculture_orders_delivery_fields
    check (fulfilment <> 'delivery'
           or (delivery_address is not null and delivery_city is not null)),
  constraint streetproculture_orders_pay_at_shop_pickup
    check (payment_method <> 'pay_at_shop' or fulfilment = 'pickup')
);

create index streetproculture_orders_status_idx
  on public.streetproculture_orders (status);
create index streetproculture_orders_user_idx
  on public.streetproculture_orders (user_id) where user_id is not null;
create unique index streetproculture_orders_public_token_idx
  on public.streetproculture_orders (public_token);
create index streetproculture_orders_session_idx
  on public.streetproculture_orders (paymongo_checkout_session_id)
  where paymongo_checkout_session_id is not null;
create index streetproculture_orders_created_idx
  on public.streetproculture_orders (created_at desc);

-- Assign the human-readable order number on insert; bump status_changed_at
-- whenever the status actually changes.
create or replace function public.streetproculture_orders_before_write()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' and (new.order_number is null or new.order_number = '') then
    new.order_number :=
      'SPC-' || to_char(nextval('public.streetproculture_order_number_seq'), 'FM000000');
  end if;
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    new.status_changed_at := now();
  end if;
  return new;
end;
$$;

create trigger streetproculture_orders_before_write
  before insert or update on public.streetproculture_orders
  for each row execute function public.streetproculture_orders_before_write();

create trigger streetproculture_orders_set_updated_at
  before update on public.streetproculture_orders
  for each row execute function public.streetproculture_set_updated_at();

alter table public.streetproculture_orders enable row level security;

-- A signed-in customer reads their own orders.
create policy streetproculture_orders_select_own
  on public.streetproculture_orders
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Superadmins read everything.
create policy streetproculture_orders_select_admin
  on public.streetproculture_orders
  for select
  to authenticated
  using (public.is_superadmin());

-- Superadmins update (status changes from /admin/orders).
create policy streetproculture_orders_update_admin
  on public.streetproculture_orders
  for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());
-- No INSERT / DELETE / anon policy. Order creation + webhook writes + guest
-- token lookups all use the service-role client.

-- ---------------------------------------------------------------------------
-- streetproculture_order_items
-- ---------------------------------------------------------------------------
create table public.streetproculture_order_items (
  id                          uuid primary key default gen_random_uuid(),
  order_id                    uuid not null
                                references public.streetproculture_orders (id) on delete cascade,
  product_id                  uuid
                                references public.streetproculture_products (id) on delete set null,
  -- Snapshot at purchase time (the product may later change price or be deleted).
  product_name                text not null,
  product_slug                text not null,
  image_url                   text,
  unit_price_centavos         integer not null check (unit_price_centavos >= 0),
  quantity                    integer not null check (quantity > 0),
  line_total_centavos         integer not null check (line_total_centavos >= 0),
  -- Whether the product tracked inventory at purchase time, so the
  -- decrement-on-payment step knows which lines to touch.
  track_inventory_at_purchase boolean not null default false,
  created_at                  timestamptz not null default now()
);

create index streetproculture_order_items_order_idx
  on public.streetproculture_order_items (order_id);

alter table public.streetproculture_order_items enable row level security;

create policy streetproculture_order_items_select
  on public.streetproculture_order_items
  for select
  to authenticated
  using (exists (
    select 1
      from public.streetproculture_orders o
     where o.id = order_id
       and (o.user_id = (select auth.uid()) or public.is_superadmin())
  ));
-- No write policy: service-role only.
