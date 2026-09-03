import Image from "next/image";
import { Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export function Manifesto() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <figure className="u-vintage relative aspect-4/5 overflow-hidden bg-coal">
            <Image
              src="/images/home/culture.jpg"
              alt="Rider wearing a CGM helmet with a Street Pro Culture decal"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <figcaption className="u-label absolute bottom-3 left-3 z-10 bg-coal/80 px-2 py-1 text-paper">
              Fig. 01 — Lids on, culture forward
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="order-1 flex flex-col justify-center lg:order-2">
          <Kicker className="text-oxblood">The Culture</Kicker>
          <h2 className="u-display mt-5 text-[clamp(2.75rem,7vw,5.5rem)]">
            Godly&nbsp;&bull; Good
            <br />
            &bull;&nbsp;Goods
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            A Filipino-owned motorcycle atelier stocking curated riding apparel,
            gears and lifestyle essentials. A multi-brand, community-driven shop
            from the Philippines — built by riders, for the ones who live on two
            wheels.
          </p>
          <p className="u-label mt-8 text-ink">
            Modern • Vintage • Retro • Classic Moto Culture
          </p>
        </Reveal>
      </div>
    </section>
  );
}
