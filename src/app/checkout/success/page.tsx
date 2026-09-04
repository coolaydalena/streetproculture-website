import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByToken } from "@/lib/orders";
import { OrderView } from "@/components/checkout/order-view";
import { CheckoutReturn } from "@/components/checkout/checkout-return";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const order = token ? await getOrderByToken(token) : null;

  if (!order) {
    return (
      <div className="bg-paper pt-16">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
          <p className="u-display text-3xl">Thanks for your order.</p>
          <p className="mt-3 text-sm text-ink-soft">
            We couldn&apos;t load the order details here. Check your email for the
            confirmation and tracking link.
          </p>
          <Link
            href="/shop"
            className="u-label mt-6 inline-block border border-ink px-6 py-3 hover:bg-ink hover:text-paper"
          >
            Back to the Shop
          </Link>
        </div>
      </div>
    );
  }

  const awaitingPayment = order.status === "pending_payment";
  const payAtShop = order.status === "pending_pay_at_shop";

  return (
    <div className="bg-paper pt-16">
      <CheckoutReturn awaitingPayment={awaitingPayment} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-line pb-6">
          <p className="u-label text-oxblood">
            {awaitingPayment ? "Almost there" : "Order placed"}
          </p>
          <h1 className="u-display mt-2 text-[clamp(2rem,6vw,3.5rem)]">
            {awaitingPayment
              ? "Confirming your payment…"
              : payAtShop
                ? "Order placed. Pay at the shop."
                : "Payment received."}
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            {awaitingPayment
              ? "This updates automatically once PayMongo confirms. You can safely leave this page."
              : payAtShop
                ? "Bring your order number to the shop to pay and collect."
                : "We'll start preparing your order. A receipt has been emailed to you."}
          </p>
        </div>

        <OrderView order={order} />

        <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
          <Link
            href={`/orders/${order.publicToken}`}
            className="u-label bg-oxblood px-6 py-3 text-paper hover:bg-oxblood-deep"
          >
            Track this order
          </Link>
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
