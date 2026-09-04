-- Street Pro Culture — Phase 2 checkout settings.
--
-- Two config tables, both superadmin-editable, both publicly readable (the
-- storefront checkout renders the fees before a customer is signed in):
--   * streetproculture_settings          single-row store-wide fee config
--   * streetproculture_payment_methods   per-method PayMongo fee + toggle

-- ---------------------------------------------------------------------------
-- streetproculture_settings — one row, enforced by a boolean primary key.
-- ---------------------------------------------------------------------------
create table public.streetproculture_settings (
  id                       boolean primary key default true
                             constraint streetproculture_settings_singleton check (id),
  -- Own handling fee: charge whichever is HIGHER of (percent of subtotal) or
  -- (fixed floor). Percent may be 0; the fixed floor may not drop below ₱100.
  own_fee_percent          numeric(5,2) not null default 0
                             check (own_fee_percent >= 0 and own_fee_percent <= 100),
  own_fee_fixed_centavos   integer not null default 10000
                             check (own_fee_fixed_centavos >= 10000),
  -- Delivery fee: a single fixed amount added to delivery orders.
  delivery_fee_centavos    integer not null default 0
                             check (delivery_fee_centavos >= 0),
  -- Feature switches.
  pay_at_shop_enabled      boolean not null default true,
  checkout_enabled         boolean not null default false,
  updated_at               timestamptz not null default now(),
  updated_by               uuid references auth.users (id) on delete set null
);

create trigger streetproculture_settings_set_updated_at
  before update on public.streetproculture_settings
  for each row execute function public.streetproculture_set_updated_at();

insert into public.streetproculture_settings (id) values (true)
  on conflict (id) do nothing;

alter table public.streetproculture_settings enable row level security;

-- Fees are shown on the storefront checkout to anonymous visitors.
create policy streetproculture_settings_public_read
  on public.streetproculture_settings
  for select
  to anon, authenticated
  using (true);

create policy streetproculture_settings_admin_update
  on public.streetproculture_settings
  for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());
-- No INSERT / DELETE policy: the single row is seeded here.

-- ---------------------------------------------------------------------------
-- streetproculture_payment_methods — the PayMongo methods we offer, each with
-- its processing fee so the checkout can compute the exact total for the
-- method the customer picks on our side.
-- ---------------------------------------------------------------------------
create table public.streetproculture_payment_methods (
  code               text primary key
                       check (code in ('card', 'gcash', 'paymaya', 'grab_pay', 'qrph')),
  label              text not null,
  -- PayMongo's cut, expressed as a percent + fixed piece. Editable by the
  -- superadmin because PayMongo's published rates change over time.
  fee_percent        numeric(5,3) not null default 0
                       check (fee_percent >= 0 and fee_percent < 100),
  fee_fixed_centavos integer not null default 0
                       check (fee_fixed_centavos >= 0),
  -- Per-method minimum charge (PayMongo enforces its own floors).
  min_centavos       integer not null default 10000
                       check (min_centavos >= 0),
  is_enabled         boolean not null default true,
  sort_order         integer not null default 0,
  updated_at         timestamptz not null default now()
);

create trigger streetproculture_payment_methods_set_updated_at
  before update on public.streetproculture_payment_methods
  for each row execute function public.streetproculture_set_updated_at();

-- Starting rates reflect PayMongo's standard published pricing at build time.
-- The superadmin tunes these on /admin/settings.
insert into public.streetproculture_payment_methods
  (code, label, fee_percent, fee_fixed_centavos, min_centavos, sort_order)
values
  ('card',     'Credit / Debit Card', 3.500, 1500, 10000, 1),
  ('gcash',    'GCash',               2.500,    0, 10000, 2),
  ('paymaya',  'Maya',                2.000,    0, 10000, 3),
  ('grab_pay', 'GrabPay',             2.500,    0, 10000, 4),
  ('qrph',     'QR Ph',               1.000,    0, 10000, 5)
on conflict (code) do nothing;

alter table public.streetproculture_payment_methods enable row level security;

create policy streetproculture_payment_methods_public_read
  on public.streetproculture_payment_methods
  for select
  to anon, authenticated
  using (is_enabled);

create policy streetproculture_payment_methods_admin_read
  on public.streetproculture_payment_methods
  for select
  to authenticated
  using (public.is_superadmin());

create policy streetproculture_payment_methods_admin_write
  on public.streetproculture_payment_methods
  for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());
