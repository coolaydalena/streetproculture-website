import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { Cta, Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Cafe",
  description:
    "Coffee at Street Pro Culture in partnership with KOPA+MLA — a place to wait out the traffic and talk shop.",
};

export default function CafePage() {
  return (
    <>
      <PageHero
        kicker="Pull Up. Sit Down."
        title="The Cafe"
        intro="A cafe corner inside the shop, run in partnership with KOPA+MLA. Coffee, a seat, and somewhere to be while the bike is on the lift or the traffic clears."
      />

      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8">
          <Reveal>
            <Kicker className="text-oxblood">The Partnership</Kicker>
            <h2 className="u-display mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
              KOPA+MLA
            </h2>
            <div className="mt-6">
              <div className="u-vintage relative aspect-square overflow-hidden bg-coal">
                <Image
                  src="/images/cafe/espresso-pull.jpg"
                  alt="Espresso pulling into a Street Pro Culture cup at the KOPA+MLA counter"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="u-label mt-3 text-ink-soft">KOPA+MLA, on the bar.</p>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              KOPA+MLA handles the coffee; we handle the garage. It&apos;s the
              same idea from both sides of the counter — do a few things
              properly and let the crew that shows up become the regulars.
            </p>
            <p className="mt-4 text-ink-soft">
              Espresso and brewed coffee, cold drinks, and a rotating short menu.
              Come for a service, stay for a cup — or just drop by.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Cta href={SITE.social.facebook}>Message Us on Facebook</Cta>
              <Cta href="/visit" variant="outline">
                Find the Shop
              </Cta>
            </div>
          </Reveal>

          <Reveal className="border border-line bg-paper-card p-8">
            <p className="u-label text-oxblood">On the Counter</p>
            <ul className="mt-4 divide-y divide-line">
              {[
                ["Espresso", "Single / double"],
                ["Brewed Coffee", "Batch, changes weekly"],
                ["Cold Brew", "House steep"],
                ["Milk Drinks", "Hot or iced"],
                ["Non-Coffee", "Chocolate, tea"],
              ].map(([item, note]) => (
                <li key={item} className="flex justify-between gap-4 py-3">
                  <span className="u-display text-xl">{item}</span>
                  <span className="u-label self-center text-ink-soft">{note}</span>
                </li>
              ))}
            </ul>
            <p className="u-label mt-6 text-ink-soft">
              Full menu &amp; pricing at the shop — {SITE.location.line}.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
