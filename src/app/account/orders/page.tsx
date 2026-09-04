import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { requireUser } from "@/lib/auth";
import { isActiveStatus, listOrdersForUser } from "@/lib/orders";
import { OrderRowList } from "@/components/checkout/order-row-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Orders",
  robots: { index: false, follow: false },
};

export default async function AccountOrdersPage() {
  await requireUser("/account/orders");
  const orders = await listOrdersForUser();
  const pending = orders.filter((o) => isActiveStatus(o.status));
  const past = orders.filter((o) => !isActiveStatus(o.status));

  return (
    <>
      <PageHero kicker="Members" title="Your Orders" />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <h2 className="u-label text-oxblood">Active</h2>
          <div className="mt-4">
            <OrderRowList orders={pending} empty="No active orders." />
          </div>
        </section>
        <section>
          <h2 className="u-label text-oxblood">Past</h2>
          <div className="mt-4">
            <OrderRowList orders={past} empty="No past orders." />
          </div>
        </section>
      </div>
    </>
  );
}
