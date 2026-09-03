import Image from "next/image";
import { Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { BRANDS } from "@/lib/brands";

export function Brands() {
  return (
    <section id="brands" className="scroll-mt-16 bg-paper-card py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Kicker className="text-oxblood">The Brands We Carry</Kicker>
            <h2 className="u-display mt-5 text-[clamp(2.5rem,6vw,4.5rem)]">
              Names on the Shelf.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            We only stock gear we would run ourselves. Fitting and after-sales are
            handled in person at the shop.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((brand, i) => (
            <Reveal key={brand.id} delay={i * 0.06} className="bg-paper-card">
              <a
                href={brand.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col items-center p-8 text-center transition-colors hover:bg-paper"
              >
                <div className="flex h-24 w-full items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={280}
                    height={100}
                    className="max-h-16 w-auto max-w-[180px] object-contain opacity-90 mix-blend-multiply grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </div>
                {/* <p className="u-label mt-6 text-oxblood">{brand.category}</p>
                <p className="mt-2 text-xs text-ink-soft">{brand.origin}</p>
                <span className="u-label mt-auto pt-6 opacity-50 transition-opacity group-hover:opacity-100">
                  {brand.name} PH ↗
                </span> */}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
