import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Cta, Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Where to find Street Pro Culture — the store, PMS bay and cafe in the Philippines.",
};

const UNDER_ONE_ROOF = [
  ["The Store", "Caps, helmets, cases and merch — fitting and shop-only drops."],
  ["The PMS Bay", "Service for motorbikes, vintage bikes and big bikes."],
  ["The Cafe", "Coffee with Upshift while you wait."],
  ["Custom Patches", "Get the badge stitched on in person."],
];

export default function VisitPage() {
  return (
    <>
      <PageHero
        kicker="Visit"
        title="Where the Culture Lives."
        intro="One address for the store, the service bay and the cafe. Walk in to browse, get fitted, or drop the bike off."
      />

      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal className="relative aspect-4/3 overflow-hidden border border-line bg-coal">
            <iframe
              title="Map to Street Pro Culture"
              src={SITE.location.embedMap}
              className="size-full grayscale-[0.3]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </Reveal>

          <Reveal className="flex flex-col justify-center">
            <Kicker className="text-oxblood">The Shop</Kicker>
            <h2 className="u-display mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
              Drop By.
            </h2>

            <dl className="mt-6 divide-y divide-line border-y border-line">
              <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="u-label text-ink-soft">Address</dt>
                <dd className="text-sm sm:max-w-xs sm:text-right">
                  {SITE.location.address}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="u-label text-ink-soft">Hours</dt>
                <dd className="u-label text-right">{SITE.location.hours}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="u-label text-ink-soft">Phone</dt>
                <dd className="u-label text-right">
                  <a href={SITE.location.phoneHref} className="hover:text-oxblood">
                    {SITE.location.phone}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-4">
              <Cta href={SITE.location.map}>Open in Maps</Cta>
              <Cta href={SITE.social.facebook} variant="outline">
                Message on Facebook
              </Cta>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {UNDER_ONE_ROOF.map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.06} className="bg-paper p-6">
                <h3 className="u-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
