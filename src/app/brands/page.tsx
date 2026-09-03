import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Official gear from CGM Italia, NZI Fibra, X-land and OZ Racing — carried, fitted and backed at Street Pro Culture.",
};

export default function BrandsPage() {
  return (
    <>
      <PageHero
        kicker="The Brands"
        title="What We Carry."
        intro="We only stock gear we would run ourselves. Fitting and after-sales are handled in person at the shop — these are the names on the shelf."
      />

      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {BRANDS.map((brand, i) => (
              <Reveal key={brand.id} delay={i * 0.06} className="bg-paper">
                <div className="flex h-full flex-col p-8">
                  <div className="flex aspect-3/1 items-center justify-center border border-line bg-coal">
                    <span className="u-display text-3xl text-paper sm:text-4xl">
                      {brand.name}
                    </span>
                  </div>
                  <p className="u-label mt-5 text-oxblood">
                    {brand.category} · {brand.origin}
                  </p>
                  <p className="mt-3 flex-1 text-sm text-ink-soft">
                    {brand.blurb}
                  </p>
                  <a
                    href={brand.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-label mt-6 inline-flex items-center gap-1.5 hover:text-oxblood"
                  >
                    {brand.name} PH ↗
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 border border-line bg-paper-card p-8 text-center">
            <p className="u-display text-2xl">Looking for a specific lid or case?</p>
            <p className="mt-2 text-ink-soft">
              Stock moves. Message us for current sizes and colours, or see
              what&apos;s listed now in the shop.
            </p>
            <Link
              href="/shop"
              className="u-label mt-5 inline-flex items-center gap-1.5 border border-ink px-6 py-3 hover:bg-ink hover:text-paper"
            >
              Open the Shop
              <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
