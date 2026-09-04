// Order status/domain types + pure helpers. Dependency-free (no "server-only")
// so client components can import the constants and transition logic.

import type { PaymentMethodCode } from "@/lib/payments";

export type OrderStatus =
  | "pending_payment"
  | "pending_pay_at_shop"
  | "paid"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled"
  | "expired";

export type Fulfilment = "pickup" | "delivery";
export type OrderPaymentMethod = PaymentMethodCode | "pay_at_shop";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  pending_pay_at_shop: "Pay at shop",
  paid: "Paid",
  preparing: "Preparing",
  ready_for_pickup: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

export const PAYMENT_METHOD_LABELS: Record<OrderPaymentMethod, string> = {
  card: "Card",
  gcash: "GCash",
  paymaya: "Maya",
  grab_pay: "GrabPay",
  qrph: "QR Ph",
  brankas_bdo: "BDO Online Banking",
  dob: "BPI Online Banking",
  brankas_landbank: "Landbank Online Banking",
  brankas_metrobank: "Metrobank Online Banking",
  dob_ubp: "UnionBank Online Banking",
  pay_at_shop: "Pay at shop",
};

/** Statuses shown under the "Pending" tab (both storefront + admin). */
export const ORDER_ACTIVE_STATUSES: OrderStatus[] = [
  "pending_payment",
  "pending_pay_at_shop",
  "paid",
  "preparing",
  "ready_for_pickup",
  "out_for_delivery",
];

export const ORDER_PAST_STATUSES: OrderStatus[] = [
  "completed",
  "cancelled",
  "expired",
];

export function isActiveStatus(status: OrderStatus): boolean {
  return ORDER_ACTIVE_STATUSES.includes(status);
}

/**
 * Admin-driven status transitions. Automatic ones (webhook → paid, webhook →
 * expired on a PayMongo `checkout_session.expired` event) are not offered here.
 */
export function nextStatuses(order: {
  status: OrderStatus;
  fulfilment: Fulfilment;
}): OrderStatus[] {
  switch (order.status) {
    case "pending_pay_at_shop":
      return ["paid", "cancelled"];
    case "pending_payment":
      return ["cancelled"];
    case "paid":
      return ["preparing", "cancelled"];
    case "preparing":
      return [
        order.fulfilment === "pickup" ? "ready_for_pickup" : "out_for_delivery",
        "cancelled",
      ];
    case "ready_for_pickup":
    case "out_for_delivery":
      return ["completed", "cancelled"];
    default:
      return [];
  }
}

export type OrderItem = {
  id: string;
  productId: string | null;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  unitPriceCentavos: number;
  quantity: number;
  lineTotalCentavos: number;
  trackInventoryAtPurchase: boolean;
};

export type Order = {
  id: string;
  orderNumber: string;
  publicToken: string;
  userId: string | null;
  status: OrderStatus;
  fulfilment: Fulfilment;
  paymentMethod: OrderPaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  pickupNotes: string | null;
  subtotalCentavos: number;
  ownFeeCentavos: number;
  paymongoFeeCentavos: number;
  deliveryFeeCentavos: number;
  serviceFeeCentavos: number;
  totalCentavos: number;
  paymongoFeeActualCentavos: number | null;
  paymongoCheckoutUrl: string | null;
  paymongoPaymentId: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  statusChangedAt: string;
  adminNotes: string | null;
  cancelledReason: string | null;
  createdAt: string;
  items: OrderItem[];
};
