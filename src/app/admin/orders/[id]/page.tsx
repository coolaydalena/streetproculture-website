import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSuperadmin } from "@/lib/auth";
import { getOrderForAdmin } from "@/lib/orders";
import { formatCentavos } from "@/lib/money";
import { OrderView } from "@/components/checkout/order-view";
import { OrderControls } from "@/components/admin/order-controls";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperadmin("/admin/orders");
  const { id } = await params;
  const order = await getOrderForAdmin(id);
  if (!order) notFound();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <Link
          href="/admin/orders"
          className="u-label text-ink-soft hover:text-ink"
        >
          ← All orders
        </Link>
        <div className="mt-4">
          <OrderView order={order} />
        </div>

        {(order.paymongoPaymentId ||
          order.paymongoFeeActualCentavos !== null) && (
          <div className="mt-8 border-t border-line pt-6 text-sm">
            <p className="u-label text-oxblood">PayMongo</p>
            <dl className="mt-3 space-y-1">
              {order.paymongoPaymentId && (
                <div className="flex gap-2">
                  <dt className="text-ink-soft">Payment ID</dt>
                  <dd className="font-mono">{order.paymongoPaymentId}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="text-ink-soft">Fee charged (estimate)</dt>
                <dd className="font-mono">
                  {formatCentavos(order.paymongoFeeCentavos)}
                </dd>
              </div>
              {order.paymongoFeeActualCentavos !== null && (
                <div className="flex gap-2">
                  <dt className="text-ink-soft">Fee actual (settled)</dt>
                  <dd className="font-mono">
                    {formatCentavos(order.paymongoFeeActualCentavos)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderControls
          orderId={order.id}
          status={order.status}
          fulfilment={order.fulfilment}
          adminNotes={order.adminNotes}
        />
      </div>
    </div>
  );
}
