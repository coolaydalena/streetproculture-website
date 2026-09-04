import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { getEnabledPaymentMethods, getSettings } from "@/lib/settings";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [settings, methods] = await Promise.all([
    getSettings(),
    getEnabledPaymentMethods(),
  ]);

  return (
    <>
      <PageHero kicker="Checkout" title="Final Check" />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {settings.checkoutEnabled && methods.length > 0 ? (
          <CheckoutClient settings={settings} methods={methods} />
        ) : (
          <div className="max-w-md space-y-4">
            <p className="u-display text-2xl">Online checkout is on the way.</p>
            <p className="text-sm text-ink-soft">
              We&apos;re not taking online orders just yet. Message us on Facebook
              to arrange a pickup or delivery.
            </p>
            <Link
              href="/shop"
              className="u-label inline-block border border-ink px-6 py-3 hover:bg-ink hover:text-paper"
            >
              Back to the Shop
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
