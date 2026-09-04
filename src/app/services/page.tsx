import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { Cta, Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "PMS & Service",
  description:
    "Preventive maintenance for motorbikes, vintage bikes and big bikes — run with Upshift at Street Pro Culture, Philippines. Also the official distributor for CGM Italia and NZI Fibra helmets.",
};

const FOCUS = [
  {
    n: "01",
    title: "Motorbikes",
    body: "Daily commuters and underbones — oil, brakes, chain, tyres, electrical. In and out on schedule.",
  },
  {
    n: "02",
    title: "Vintage Bikes",
    body: "Classic and cafe builds handled by people who understand old metal — carbs, points, wiring, sympathetic fixes.",
  },
  {
    n: "03",
    title: "Big Bikes",
    body: "Large-displacement machines — full PMS intervals, diagnostics, fluid service and pre-tour checks.",
  },
];

const CHECKLIST = [
  "Engine oil & filter",
  "Brake pads & fluid",
  "Chain, sprockets & tension",
  "Tyre condition & pressure",
  "Battery & charging system",
  "Lights & electrical",
  "Bolt torque & safety check",
  "Road test",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Motorcycle Atelier"
        title="The Services."
        intro="Preventive maintenance done by riders, not a call centre — run together with Upshift under the Street Pro roof. We work on motorbikes, vintage builds and big bikes, booked through Facebook, serviced at the shop."
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <Kicker className="text-oxblood">The Partnership</Kicker>
            <h2 className="u-display mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
              Upshift
            </h2>
            <div className="mt-6 inline-flex border border-line bg-white px-6 py-4">
              <Image
                src="/images/brands/upshift.png"
                alt="Upshift Manila logo"
                width={200}
                height={110}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Upshift runs the service side of the shop — two brands, one roof.
              Same crew whether you&apos;re booking a PMS or just dropping by.
            </p>
          </Reveal>

          <Reveal className="border border-line bg-paper-card p-8">
            <p className="u-label text-oxblood">Also Under This Roof</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Official Philippine distributor and dealer for CGM Italia and NZI
              Fibra helmets, plus X-land cases and OZ Racing gear — see the
              full lineup.
            </p>
            <div className="mt-6">
              <Cta href="/#brands" variant="outline">
                See the Brands
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-px border border-line bg-line md:grid-cols-3">
            {FOCUS.map((f, i) => (
              <Reveal key={f.n} delay={i * 0.08} className="bg-paper p-8">
                <p className="u-display text-5xl text-oxblood">{f.n}</p>
                <h2 className="u-display mt-4 text-3xl">{f.title}</h2>
                <p className="mt-3 text-sm text-ink-soft">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="u-texture bg-coal py-20 text-paper sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal className="relative aspect-4/3 overflow-hidden bg-coal-soft">
            <Image
              src="/images/services/pms-bay.jpg"
              alt="Motorcycle up on the stand in the Street Pro Culture PMS bay"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal className="flex flex-col justify-center">
            <Kicker className="text-gold">Standard PMS</Kicker>
            <h2 className="u-display mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
              What We Check.
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="u-label border-b border-paper/15 py-2.5 text-paper/80"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-paper/60">
              Parts and labour quoted before any work starts. Bring the bike, or
              message us first for slot availability.
            </p>
            <div className="mt-8">
              <Cta href={SITE.social.facebook}>Book via Facebook</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
