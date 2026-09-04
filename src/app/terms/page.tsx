import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Prose } from "@/components/layout/prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use the Street Pro Culture website and place an order.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "September 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Terms of Service" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Prose>
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            Last updated: {UPDATED}
          </p>
          <p>
            These terms govern your use of this website and any order you place
            with Street Pro Culture. By using the site or placing an order, you
            agree to them.
          </p>

          <h2>Orders and pricing</h2>
          <ul>
            <li>
              All prices are in Philippine Pesos (₱) and include applicable
              taxes unless stated otherwise.
            </li>
            <li>
              A <strong>service fee</strong> is added at checkout and shown
              before you pay. It covers payment processing and order handling.
            </li>
            <li>
              An order is an offer to buy. It is accepted when we confirm it and,
              for online payments, when payment is received. We may decline or
              cancel an order (for example, pricing errors, suspected fraud, or
              stock that sells out), in which case any payment is refunded.
            </li>
            <li>
              Product images and descriptions are provided in good faith; minor
              variation in colour or finish is normal.
            </li>
          </ul>

          <h2>Payment</h2>
          <p>
            Online payments are processed by <strong>PayMongo</strong>. You
            enter card or e-wallet details on PayMongo&apos;s secure checkout; we
            never receive them. &ldquo;Pay at the shop&rdquo; orders are held for
            collection and paid in person.
          </p>

          <h2>Fulfilment</h2>
          <ul>
            <li>
              <strong>Pickup</strong> is at {SITE.location.line} during opening
              hours ({SITE.location.hours}). Bring your order number.
            </li>
            <li>
              <strong>Delivery</strong> is handled by third-party couriers to the
              address and map pin you provide. Delivery times are estimates, not
              guarantees.
            </li>
            <li>
              Risk in the goods passes to you on collection or delivery. Please
              check items on receipt.
            </li>
          </ul>

          <h2>Returns and refunds</h2>
          <p>
            Returns, cancellations and refunds are governed by our{" "}
            <Link href="/refund-policy">Refund Policy</Link>. In summary, only
            the item price is refundable — the service fee is not.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not misuse the site, attempt to disrupt it, or use it for unlawful
            purposes. Content on the site (text, images, branding) belongs to
            Street Pro Culture or its licensors and may not be reused without
            permission.
          </p>

          <h2>Liability</h2>
          <p>
            Nothing in these terms limits rights you have under the Philippine
            Consumer Act (RA 7394) or other mandatory law. Subject to that, our
            liability for any order is limited to the amount you paid for it, and
            we are not liable for indirect or consequential loss.
          </p>

          <h2>Changes and governing law</h2>
          <p>
            We may update these terms; the version in effect when you order
            applies to that order. These terms are governed by the laws of the
            Republic of the Philippines, and disputes are subject to the courts
            of Manila.
          </p>

          <h2>Contact</h2>
          <p>
            Street Pro Culture — {SITE.location.address}. Phone{" "}
            <a href={SITE.location.phoneHref}>{SITE.location.phone}</a>.
          </p>
        </Prose>
      </div>
    </>
  );
}
