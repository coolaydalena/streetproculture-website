import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Prose } from "@/components/layout/prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "How refunds, returns and cancellations work for Street Pro Culture shop orders.",
  alternates: { canonical: "/refund-policy" },
};

const UPDATED = "September 2026";

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Refund Policy" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Prose>
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            Last updated: {UPDATED}
          </p>

          <h2>What is refundable</h2>
          <p>
            If an order is cancelled or an item is returned under this policy, we
            refund the <strong>price of the items only</strong> (the order
            subtotal).
          </p>
          <p>
            The <strong>service fee is non-refundable</strong>. It covers payment
            processing charged by our provider and our order handling, and those
            costs are incurred as soon as an order is placed — they are not
            returned to us when a payment is reversed. Any delivery fee already
            incurred is likewise non-refundable once a courier has been
            dispatched.
          </p>
          <p>
            Example: an item priced ₱100 with a ₱10 service fee is charged ₱110.
            The maximum refund is <strong>₱100</strong>.
          </p>

          <h2>When you can request a refund</h2>
          <ul>
            <li>
              The item is defective, damaged in transit, or materially different
              from its listing.
            </li>
            <li>
              We cancel or cannot fulfil your order (for example, the item is out
              of stock after you paid).
            </li>
            <li>
              You cancel an online order <strong>before</strong> it has been
              prepared or handed to a courier.
            </li>
          </ul>
          <p>
            Change-of-mind returns on correctly supplied items are at our
            discretion and, where accepted, exclude the service fee and any
            shipping both ways.
          </p>

          <h2>What is not covered</h2>
          <ul>
            <li>Normal wear, misuse, or damage after delivery or collection.</li>
            <li>
              Items marked final sale, and made-to-order or personalised items.
            </li>
            <li>
              Sizing or fit issues where the listed measurements were accurate —
              please check them before ordering.
            </li>
          </ul>

          <h2>How to request one</h2>
          <p>
            Message us on{" "}
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>{" "}
            or call{" "}
            <a href={SITE.location.phoneHref}>{SITE.location.phone}</a> within{" "}
            <strong>7 days</strong> of receiving or collecting your order. Include
            your order number (SPC-XXXXXX) and, for damage or defect claims,
            clear photos.
          </p>

          <h2>Processing</h2>
          <p>
            Approved refunds for orders paid online are returned to your
            original payment method through PayMongo. We can only release a
            refund once our payment processor settles the payment to us, so
            this can take <strong>up to 30 days</strong> from approval — we
            aim to do it sooner whenever we can. Orders paid in person at the
            shop are refunded in person.
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
