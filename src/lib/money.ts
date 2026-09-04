// Order money helpers. All order amounts are integer centavos (PHP); product
// prices are whole pesos and are multiplied by 100 when they land on an order.
//
// Dependency-free so both server code (checkout action, webhook) and client
// components (the checkout breakdown) can import it.

import { CURRENCY, LOCALE } from "@/lib/site";

export const PAYMONGO_MIN_CENTAVOS = 10000; // ₱100 — PayMongo's global minimum

export function pesosToCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}

const centavoFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Render a centavo amount as ₱1,234.50. */
export function formatCentavos(centavos: number): string {
  return centavoFormatter.format(centavos / 100);
}

export type PricingInput = {
  /** Cart lines, priced from the live catalogue (server-side). */
  items: { unitPriceCentavos: number; quantity: number }[];
  fulfilment: "pickup" | "delivery";
  /** `null` for pay-at-shop (no PayMongo transaction). */
  method: {
    feePercent: number; // e.g. 3.5
    feeFixedCentavos: number;
    minCentavos: number;
  } | null;
  settings: {
    ownFeePercent: number; // e.g. 2.5
    ownFeeFixedCentavos: number;
    deliveryFeeCentavos: number;
  };
};

export type Pricing = {
  subtotalCentavos: number;
  ownFeeCentavos: number;
  paymongoFeeCentavos: number;
  deliveryFeeCentavos: number;
  /** own fee + PayMongo fee — the single "Service Fee" line shown to the customer. */
  serviceFeeCentavos: number;
  totalCentavos: number;
};

/**
 * Recompute an order's pricing from trusted inputs. Never fed client totals.
 *
 * own fee     = max( round(subtotal × own_fee_percent%), own_fee_fixed )
 * delivery    = fixed, only when fulfilment = 'delivery'
 * PayMongo    = 0 for pay-at-shop; otherwise grossed up so the fee PayMongo
 *               deducts from the payout is fully recovered from the customer.
 */
export function computeOrderPricing(input: PricingInput): Pricing {
  const { items, fulfilment, method, settings } = input;

  const subtotalCentavos = items.reduce(
    (sum, i) => sum + i.unitPriceCentavos * i.quantity,
    0,
  );

  const ownFeeCentavos = Math.max(
    Math.round((subtotalCentavos * settings.ownFeePercent) / 100),
    settings.ownFeeFixedCentavos,
  );

  const deliveryFeeCentavos =
    fulfilment === "delivery" ? settings.deliveryFeeCentavos : 0;

  const baseCentavos = subtotalCentavos + ownFeeCentavos + deliveryFeeCentavos;

  let paymongoFeeCentavos = 0;
  let totalCentavos = baseCentavos;

  if (method) {
    const rate = method.feePercent / 100;
    // total = base + fee, where fee = total × rate + fixed
    //   ⇒ total = (base + fixed) / (1 − rate)
    totalCentavos = Math.ceil(
      (baseCentavos + method.feeFixedCentavos) / (1 - rate),
    );
    paymongoFeeCentavos = totalCentavos - baseCentavos;
  }

  return {
    subtotalCentavos,
    ownFeeCentavos,
    paymongoFeeCentavos,
    deliveryFeeCentavos,
    serviceFeeCentavos: ownFeeCentavos + paymongoFeeCentavos,
    totalCentavos,
  };
}

/** The PayMongo minimum that applies to a given method (falls back to global). */
export function methodMinimumCentavos(method: { minCentavos: number } | null): number {
  return Math.max(PAYMONGO_MIN_CENTAVOS, method?.minCentavos ?? 0);
}
