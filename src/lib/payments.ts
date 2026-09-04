// Payment / settings domain types + constants. Dependency-free (no "server-only")
// so client components, validation schemas and server code can all import it.

/** Revalidated whenever the superadmin saves /admin/settings. */
export const SETTINGS_TAG = "settings";

export const PAYMENT_METHOD_CODES = [
  "card",
  "gcash",
  "paymaya",
  "grab_pay",
  "qrph",
] as const;
export type PaymentMethodCode = (typeof PAYMENT_METHOD_CODES)[number];

export type StoreSettings = {
  ownFeePercent: number;
  ownFeeFixedCentavos: number;
  deliveryFeeCentavos: number;
  payAtShopEnabled: boolean;
  checkoutEnabled: boolean;
};

export type PaymentMethod = {
  code: PaymentMethodCode;
  label: string;
  feePercent: number;
  feeFixedCentavos: number;
  minCentavos: number;
  isEnabled: boolean;
  sortOrder: number;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  ownFeePercent: 0,
  ownFeeFixedCentavos: 10000,
  deliveryFeeCentavos: 0,
  payAtShopEnabled: true,
  checkoutEnabled: false,
};

export const SETTINGS_COLUMNS =
  "own_fee_percent, own_fee_fixed_centavos, delivery_fee_centavos, pay_at_shop_enabled, checkout_enabled";
export const PAYMENT_METHOD_COLUMNS =
  "code, label, fee_percent, fee_fixed_centavos, min_centavos, is_enabled, sort_order";

type SettingsRow = {
  own_fee_percent: number | string;
  own_fee_fixed_centavos: number;
  delivery_fee_centavos: number;
  pay_at_shop_enabled: boolean;
  checkout_enabled: boolean;
};

type MethodRow = {
  code: PaymentMethodCode;
  label: string;
  fee_percent: number | string;
  fee_fixed_centavos: number;
  min_centavos: number;
  is_enabled: boolean;
  sort_order: number;
};

export function rowToSettings(row: SettingsRow): StoreSettings {
  return {
    ownFeePercent: Number(row.own_fee_percent),
    ownFeeFixedCentavos: row.own_fee_fixed_centavos,
    deliveryFeeCentavos: row.delivery_fee_centavos,
    payAtShopEnabled: row.pay_at_shop_enabled,
    checkoutEnabled: row.checkout_enabled,
  };
}

export function rowToPaymentMethod(row: MethodRow): PaymentMethod {
  return {
    code: row.code,
    label: row.label,
    feePercent: Number(row.fee_percent),
    feeFixedCentavos: row.fee_fixed_centavos,
    minCentavos: row.min_centavos,
    isEnabled: row.is_enabled,
    sortOrder: row.sort_order,
  };
}
