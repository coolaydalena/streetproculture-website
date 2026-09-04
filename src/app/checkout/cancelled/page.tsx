import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByToken } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  robots: { index: false, follow: false },
};

export default async function CheckoutCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const order = token ? await getOrderByToken(token) : null;
  const canRetry =
    order?.status === "pending_payment" && !!order.paymongoCheckoutUrl;

  return (
    <div className="bg-paper pt-16">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="u-label text-oxblood">Payment cancelled</p>
        <h1 className="u-display mt-2 text-[clamp(2rem,6vw,3.5rem)]">
          No payment was taken.
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          {order
            ? `Your order ${order.orderNumber} is on hold. You can try the payment again or head back to the shop.`
            : "You can head back to the shop and start again."}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {canRetry && (
            <a
              href={order!.paymongoCheckoutUrl!}
              className="u-label bg-oxblood px-6 py-3 text-paper hover:bg-oxblood-deep"
            >
              Try payment again
            </a>
          )}
          {order && (
            <Link
              href={`/orders/${order.publicToken}`}
              className="u-label border border-ink px-6 py-3 hover:bg-ink hover:text-paper"
            >
              View order
            </Link>
          )}
          <Link
            href="/shop"
            className="u-label border border-ink px-6 py-3 hover:bg-ink hover:text-paper"
          >
            Back to the Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
