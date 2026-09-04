import Link from "next/link";
import { formatCentavos } from "@/lib/money";
import { PAYMENT_METHOD_LABELS, type Order } from "@/lib/order-status";
import { OrderStatusBadge } from "@/components/checkout/order-status-badge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", { dateStyle: "medium" });
}

/** Compact order rows for the account history + admin lists. */
export function OrderRowList({
  orders,
  hrefBase = "/orders",
  hrefKey = "publicToken",
  empty = "No orders yet.",
}: {
  orders: Order[];
  /** `/orders` (public token) for account, `/admin/orders` (id) for admin. */
  hrefBase?: string;
  hrefKey?: "publicToken" | "id";
  empty?: string;
}) {
  if (orders.length === 0) {
    return <p className="text-sm text-ink-soft">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="u-label p-3 text-ink-soft">Order</th>
            <th className="u-label p-3 text-ink-soft">Date</th>
            <th className="u-label p-3 text-ink-soft">Fulfilment</th>
            <th className="u-label p-3 text-ink-soft">Payment</th>
            <th className="u-label p-3 text-ink-soft">Total</th>
            <th className="u-label p-3 text-ink-soft">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-line last:border-0">
              <td className="p-3">
                <Link
                  href={`${hrefBase}/${o[hrefKey]}`}
                  className="u-display text-base hover:text-oxblood"
                >
                  {o.orderNumber}
                </Link>
              </td>
              <td className="p-3 text-ink-soft">{formatDate(o.createdAt)}</td>
              <td className="p-3 capitalize">{o.fulfilment}</td>
              <td className="p-3">{PAYMENT_METHOD_LABELS[o.paymentMethod]}</td>
              <td className="p-3 font-mono">
                {formatCentavos(o.totalCentavos)}
              </td>
              <td className="p-3">
                <OrderStatusBadge status={o.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
