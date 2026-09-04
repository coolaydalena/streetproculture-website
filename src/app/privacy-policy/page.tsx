import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Prose } from "@/components/layout/prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Street Pro Culture collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "September 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Privacy Policy" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Prose>
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            Last updated: {UPDATED}
          </p>
          <p>
            This policy explains how Street Pro Culture (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;) handles personal information when you use this
            website and shop. We follow the Philippine Data Privacy Act of 2012
            (RA 10173).
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Account:</strong> your name, email address and profile
              photo when you sign in with Google.
            </li>
            <li>
              <strong>Orders:</strong> contact name, email, phone number,
              delivery address and any map pin or notes you provide, and your
              order history.
            </li>
            <li>
              <strong>Payment:</strong> processed by PayMongo. We receive a
              payment reference, status, method and the processor&apos;s fee — we
              do <strong>not</strong> receive or store your full card number.
            </li>
            <li>
              <strong>Technical:</strong> standard server logs and, if you
              consent, your device location when you use &ldquo;use my
              location&rdquo; at checkout.
            </li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To process, deliver and support your orders.</li>
            <li>To let you sign in and view your order history.</li>
            <li>
              To contact you about an order, a return, or a fulfilment problem.
            </li>
            <li>To keep the site secure and meet legal and tax obligations.</li>
          </ul>
          <p>
            We do not sell your personal information, and we do not use it for
            advertising.
          </p>

          <h2>Who we share it with</h2>
          <ul>
            <li>
              <strong>PayMongo</strong> — to take and reconcile payments.
            </li>
            <li>
              <strong>Supabase</strong> — our database and authentication host.
            </li>
            <li>
              <strong>Delivery couriers</strong> — the name, address, pin and
              phone needed to complete your delivery.
            </li>
            <li>
              <strong>Google</strong> — sign-in only, per your Google account
              settings.
            </li>
            <li>Authorities, where required by law.</li>
          </ul>

          <h2>Retention</h2>
          <p>
            Order and transaction records are kept for at least the period
            required by Philippine tax and commercial law. You can ask us to
            delete your account profile; records tied to completed transactions
            may be retained where the law requires.
          </p>

          <h2>Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal information, and you may object to certain processing.
            Contact us using the details below. You also have the right to lodge
            a complaint with the National Privacy Commission.
          </p>

          <h2>Cookies</h2>
          <p>
            We use only essential storage — a session cookie to keep you signed
            in and local storage to remember your cart. No third-party
            advertising or analytics cookies are set.
          </p>

          <h2>Contact</h2>
          <p>
            Street Pro Culture — {SITE.location.address}. Phone{" "}
            <a href={SITE.location.phoneHref}>{SITE.location.phone}</a>, or
            message us on{" "}
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            .
          </p>
        </Prose>
      </div>
    </>
  );
}
