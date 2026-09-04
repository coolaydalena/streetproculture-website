import Image from "next/image";
import { SITE } from "@/lib/site";
import { formatCentavos } from "@/lib/money";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type Order,
  type OrderStatus,
} from "@/lib/order-status";
import { OrderBreakdown } from "@/components/checkout/order-breakdown";
import { OrderStatusBadge } from "@/components/checkout/order-status-badge";
import { RefundNotice } from "@/components/checkout/refund-notice";

function timeline(order: Order): OrderStatus[] {
  const start: OrderStatus =
    order.paymentMethod === "pay_at_shop" ? "pending_pay_at_shop" : "pending_payment";
  const mid: OrderStatus =
    order.fulfilment === "pickup" ? "ready_for_pickup" : "out_for_delivery";
  return [start, "paid", "preparing", mid, "completed"];
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function OrderView({ order }: { order: Order }) {
  const steps = timeline(order);
  const currentIndex = steps.indexOf(order.status);
  const closed = order.status === "cancelled" || order.status === "expired";

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="u-label text-oxblood">Order</p>
          <p className="u-display text-3xl">{order.orderNumber}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      {closed ? (
        <p className="border border-line bg-paper-card p-4 text-sm text-ink-soft">
          This order is {ORDER_STATUS_LABELS[order.status].toLowerCase()}.
          {order.cancelledReason ? ` ${order.cancelledReason}.` : ""}
        </p>
      ) : (
        <ol className="space-y-3">
          {steps.map((step, i) => {
            const done = i <= currentIndex;
            return (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                    done
                      ? "border-oxblood bg-oxblood text-paper"
                      : "border-line text-ink-soft"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`u-label !tracking-[0.12em] ${
                    i === currentIndex ? "text-oxblood" : done ? "" : "text-ink-soft"
                  }`}
                >
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <section>
        <h2 className="u-label text-oxblood">Items</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative size-14 shrink-0 overflow-hidden bg-coal">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="u-display text-lg leading-tight">
                  {item.productName}
                </p>
                <p className="text-sm text-ink-soft">
                  {formatCentavos(item.unitPriceCentavos)} × {item.quantity}
                </p>
              </div>
              <span className="font-mono text-sm">
                {formatCentavos(item.lineTotalCentavos)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 max-w-xs sm:ml-auto">
          <OrderBreakdown
            subtotalCentavos={order.subtotalCentavos}
            serviceFeeCentavos={order.serviceFeeCentavos}
            deliveryFeeCentavos={order.deliveryFeeCentavos}
            totalCentavos={order.totalCentavos}
            ownFeeCentavos={order.ownFeeCentavos}
            paymongoFeeCentavos={order.paymongoFeeCentavos}
          />
          <RefundNotice className="mt-4 border-t border-line pt-3" />
        </div>
      </section>

      <section className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="u-label text-oxblood">
            {order.fulfilment === "pickup" ? "Pickup" : "Delivery"}
          </h2>
          {order.fulfilment === "pickup" ? (
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-ink-soft">{SITE.location.address}</p>
              <p className="text-ink-soft">{SITE.location.hours}</p>
              {order.pickupNotes && (
                <p className="mt-2">
                  <span className="u-label text-ink-soft">Notes: </span>
                  {order.pickupNotes}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-3 space-y-1 text-sm">
              <p>{order.deliveryAddress}</p>
              <p>{order.deliveryCity}</p>
              {order.deliveryLat != null && order.deliveryLng != null && (
                <a
                  href={`https://www.google.com/maps?q=${order.deliveryLat},${order.deliveryLng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="u-label inline-block pt-1 text-oxblood hover:underline"
                >
                  View pinned location ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="u-label text-oxblood">Payment</h2>
          <div className="mt-3 space-y-1 text-sm">
            <p>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
            <p className="text-ink-soft">
              {order.paidAt
                ? `Paid ${formatDateTime(order.paidAt)}`
                : order.paymentMethod === "pay_at_shop"
                  ? "To be paid at the shop"
                  : "Awaiting payment"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="u-label text-oxblood">Contact</h2>
          <div className="mt-3 space-y-1 text-sm">
            <p>{order.customerName}</p>
            <p className="text-ink-soft">{order.customerEmail}</p>
            <p className="text-ink-soft">{order.customerPhone}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
