import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const PILLARS = [
  {
    n: "01",
    href: "/services",
    title: "The Service",
    body: "Preventive maintenance for motorbikes, vintage builds and big bikes — run with Upshift, done by people who ride what they wrench.",
    cta: "Book a service",
  },
  {
    n: "02",
    href: "/cafe",
    title: "The Cafe",
    body: "Coffee and a place to sit, in partnership with KOPA+MLA. Pull up, talk shop, wait out the traffic.",
    cta: "Meet KOPA+MLA",
  },
  {
    n: "03",
    href: "/#brands",
    title: "The Brands",
    body: "Official gear from CGM Italia, NZI Fibra, X-land and OZ Racing — fitted and backed at the shop.",
    cta: "See the lineup",
  },
];

export function OneRoof() {
  return (
    <section className="relative overflow-hidden bg-coal py-24 text-paper sm:py-32">
      <Image
        src="/images/home/more-than-a-shop.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <Kicker className="text-gold">More than a shop</Kicker>
          <h2 className="u-display mt-5 text-[clamp(2.5rem,6vw,4.5rem)]">
            One roof. Ride, wrench, refuel.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px border border-paper/15 bg-paper/15 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08} className="bg-coal">
              <Link
                href={p.href}
                className="group flex h-full flex-col p-8 transition-colors hover:bg-coal/60"
              >
                <p className="u-display text-5xl text-oxblood">{p.n}</p>
                <h3 className="u-display mt-4 text-3xl">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm text-paper/60">{p.body}</p>
                <span className="u-label mt-6 inline-flex items-center gap-1.5">
                  {p.cta}
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
