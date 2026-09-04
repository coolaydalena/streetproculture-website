import Link from "next/link";
import { requireSuperadmin } from "@/lib/auth";
import { isActiveStatus, listOrdersForAdmin } from "@/lib/orders";
import { OrderRowList } from "@/components/checkout/order-row-list";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireSuperadmin("/admin/orders");
  const { tab } = await searchParams;
  const showPast = tab === "past";

  const orders = await listOrdersForAdmin();
  const pending = orders.filter((o) => isActiveStatus(o.status));
  const past = orders.filter((o) => !isActiveStatus(o.status));
  const visible = showPast ? past : pending;

  const tabClass = (active: boolean) =>
    `u-label border px-4 py-2 ${
      active ? "border-oxblood bg-oxblood text-paper" : "border-line text-ink-soft"
    }`;

  return (
    <div>
      <h1 className="u-display text-3xl">Orders</h1>

      <div className="mt-6 flex gap-2">
        <Link href="/admin/orders" className={tabClass(!showPast)}>
          Pending ({pending.length})
        </Link>
        <Link href="/admin/orders?tab=past" className={tabClass(showPast)}>
          Past ({past.length})
        </Link>
      </div>

      <div className="mt-6">
        <OrderRowList
          orders={visible}
          hrefBase="/admin/orders"
          hrefKey="id"
          empty={showPast ? "No past orders." : "No pending orders."}
        />
      </div>
    </div>
  );
}
