import Image from "next/image";
import Link from "next/link";
import { Cta, Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice } from "@/lib/site";
import { getFeatured } from "@/lib/products";

export function ArsenalPreview() {
  const featured = getFeatured();
  return (
    <section className="border-t border-line bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker className="text-oxblood">The Shop</Kicker>
            <h2 className="u-display mt-5 text-[clamp(2.5rem,6vw,4.5rem)]">
              Wear the Culture.
            </h2>
          </div>
          <Cta href="/shop" variant="outline">
            Enter the Shop
          </Cta>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <Link
                href={`/shop/${p.slug}`}
                className={`group block ${i % 2 === 1 ? "sm:mt-16" : ""}`}
              >
                <div className="border border-ink/15 p-3">
                  <div className="relative aspect-3/4 w-full overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/20 pt-3">
                  <div>
                    <p className="u-label text-ink-soft">{p.tag}</p>
                    <h3 className="u-display mt-1 text-2xl leading-none">
                      {p.name}
                    </h3>
                  </div>
                  <p className="font-mono text-lg text-oxblood">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
