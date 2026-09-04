import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";

const TONE: Record<OrderStatus, string> = {
  pending_payment: "border-gold text-gold",
  pending_pay_at_shop: "border-gold text-gold",
  paid: "border-ink text-ink",
  preparing: "border-ink text-ink",
  ready_for_pickup: "border-oxblood text-oxblood",
  out_for_delivery: "border-oxblood text-oxblood",
  completed: "border-ink bg-ink text-paper",
  cancelled: "border-ink-soft text-ink-soft line-through",
  expired: "border-ink-soft text-ink-soft line-through",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`u-label inline-block border px-2 py-1 !tracking-[0.14em] ${TONE[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
