-- Support PayMongo methods priced as "X% or ₱Y, whichever is higher" (a floor)
-- as opposed to "X% + ₱Y" (both applied, e.g. Cards). Verified against
-- PayMongo's published Philippines pricing at paymongo.com/en-ph/pricing:
--
--   Cards                   3.125% + ₱13.39            (additive — unchanged)
--   Direct Online Banking   0.71% or ₱13.39, higher     (floor — new)
--
-- Direct Online Banking is ONE flat rate covering BDO, BPI, Landbank,
-- Metrobank and UnionBank alike — PayMongo does not price these banks
-- individually.

alter table public.streetproculture_payment_methods
  add column fee_is_floor boolean not null default false;

update public.streetproculture_payment_methods
set
  fee_percent = 0.710,
  fee_fixed_centavos = 1339, -- ₱13.39
  fee_is_floor = true
where code in (
  'brankas_bdo', 'dob', 'brankas_landbank', 'brankas_metrobank', 'dob_ubp'
);
