import Image from "next/image";
import { Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export function Manifesto() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <figure className="relative aspect-4/5 overflow-hidden bg-coal">
            <Image
              src="/images/home/manifesto-strap.jpg"
              alt="Rider fastening a helmet chin strap"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <figcaption className="u-label absolute bottom-3 left-3 bg-coal/80 px-2 py-1 text-paper">
              Fig. 01 — Strap it down
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="order-1 flex flex-col justify-center lg:order-2">
          <Kicker className="text-oxblood">The Manifesto</Kicker>
          <h2 className="u-display mt-5 text-[clamp(2.75rem,7vw,5.5rem)]">
            Built for
            <br />
            the Bold.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Street Pro Culture was born in a garage, not a boardroom. We make a
            small line of caps and helmets the way engines are built — heavy on
            honesty, light on shortcuts.
          </p>
          <p className="u-label mt-8 text-ink">Godly • Good • Goods</p>
        </Reveal>
      </div>
    </section>
  );
}
