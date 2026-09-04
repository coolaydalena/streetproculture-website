import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByToken } from "@/lib/orders";
import { OrderView } from "@/components/checkout/order-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  return (
    <div className="bg-paper pt-16">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <OrderView order={order} />
        <p className="mt-10 border-t border-line pt-6 text-xs text-ink-soft">
          Bookmark this page to track your order. Anyone with this link can view
          these details.
        </p>
      </div>
    </div>
  );
}
