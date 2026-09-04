-- Add PayMongo's Direct Online Banking / Brankas payment channels.
--
-- Code values are PayMongo's exact `payment_method_types` enum entries (verified
-- against the live API — see paymongo.ts), not a naming choice of ours:
--   brankas_bdo, brankas_landbank, brankas_metrobank  — Brankas-powered banks
--   dob                                                — BPI Direct Online Banking
--   dob_ubp                                            — UnionBank Direct Online Banking
--
-- Seeded disabled with 0% fees: PayMongo does not publish rates for these
-- channels (quoted per-merchant). The superadmin must fill in the real
-- processing fee from the PayMongo dashboard and flip is_enabled on
-- /admin/settings before these go live — otherwise the shop absorbs the fee.

alter table public.streetproculture_payment_methods
  drop constraint streetproculture_payment_methods_code_check;

alter table public.streetproculture_payment_methods
  add constraint streetproculture_payment_methods_code_check
  check (code in (
    'card', 'gcash', 'paymaya', 'grab_pay', 'qrph',
    'brankas_bdo', 'brankas_landbank', 'brankas_metrobank', 'dob', 'dob_ubp'
  ));

-- streetproculture_orders.payment_method has its own, separate check
-- constraint (it also allows 'pay_at_shop', which is not a row in
-- streetproculture_payment_methods) — must be widened too.
alter table public.streetproculture_orders
  drop constraint streetproculture_orders_payment_method_check;

alter table public.streetproculture_orders
  add constraint streetproculture_orders_payment_method_check
  check (payment_method in (
    'card', 'gcash', 'paymaya', 'grab_pay', 'qrph',
    'brankas_bdo', 'brankas_landbank', 'brankas_metrobank', 'dob', 'dob_ubp',
    'pay_at_shop'
  ));

insert into public.streetproculture_payment_methods
  (code, label, fee_percent, fee_fixed_centavos, min_centavos, is_enabled, sort_order)
values
  ('brankas_bdo',       'BDO Online Banking',       0, 0, 10000, false, 6),
  ('dob',               'BPI Online Banking',       0, 0, 10000, false, 7),
  ('brankas_landbank',  'Landbank Online Banking',  0, 0, 10000, false, 8),
  ('brankas_metrobank', 'Metrobank Online Banking', 0, 0, 10000, false, 9),
  ('dob_ubp',           'UnionBank Online Banking', 0, 0, 10000, false, 10)
on conflict (code) do nothing;
