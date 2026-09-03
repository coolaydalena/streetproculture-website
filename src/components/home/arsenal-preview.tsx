import { Cta, Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/shop/product-card";
import { getFeatured } from "@/lib/products";

export function ArsenalPreview() {
  const featured = getFeatured();
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Kicker className="text-oxblood">The Arsenal — Preview</Kicker>
            <h2 className="u-display mt-5 text-[clamp(2.5rem,6vw,4.5rem)]">
              Wear the Culture.
            </h2>
          </div>
          <Cta href="/shop" variant="outline">
            Enter the Shop
          </Cta>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
