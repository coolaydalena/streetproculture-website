import Image from "next/image";
import { Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const PRINCIPLES = [
  {
    n: "01",
    title: "Moto Lifestyle",
    body: "One garage, one crew, no shortcuts.",
  },
  {
    n: "02",
    title: "Godly Good Goods",
    body: "Materials that earn the patch on them.",
  },
  {
    n: "03",
    title: "Built for the Street",
    body: "Designed at speed, proven at a stoplight.",
  },
];

export function Heritage() {
  return (
    <section className="relative overflow-hidden bg-coal py-24 text-paper sm:py-32">
      <Image
        src="/images/home/heritage-garage.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <Kicker className="text-gold">The Heritage</Kicker>
          <h2 className="u-display mt-5 text-[clamp(2.75rem,7vw,5.5rem)]">
            Analog Soul,
            <br />
            Asphalt Blood.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-paper/70">
            Everything we sell passes through the same hands that ride with it. If
            it can&apos;t survive a season of dust, sun, and hard miles, it never
            gets the patch.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px border border-paper/15 bg-paper/15 sm:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              key={p.n}
              delay={i * 0.08}
              className="bg-coal p-8"
            >
              <p className="u-display text-5xl text-oxblood">{p.n}</p>
              <p className="u-label mt-4 text-paper">{p.title}</p>
              <p className="mt-2 text-sm text-paper/60">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
