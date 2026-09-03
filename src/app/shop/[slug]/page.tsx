import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  PRODUCTS,
  categoryLabel,
  getProductBySlug,
  getRelated,
} from "@/lib/products";
import { SITE, formatPrice } from "@/lib/site";
import { Kicker } from "@/components/ui/primitives";
import { ProductCard } from "@/components/shop/product-card";
import { ProductBuyPanel } from "@/components/shop/product-buy-panel";

type Props = { params: Promise<{ slug: string }> };

/* Prerender one static page per product in the catalogue. */
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

/*
  ── SEO — PARKED ────────────────────────────────────────────────────────────
  UI first. When SEO work resumes, this route should also carry:
    • canonical URL (alternates.canonical) + per-product openGraph/twitter image
    • Product JSON-LD  (name, image, description, brand, offers → price,
      priceCurrency PHP, availability, itemCondition)
    • BreadcrumbList JSON-LD mirroring the visible breadcrumb
    • sitemap.ts entry enumerating every /shop/[slug]
  Emit the JSON-LD from a <script type="application/ld+json"> in this file.
  Only the basic title/description is wired up for now.
*/
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.blurb,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelated(product);
  const category = categoryLabel(product.category);

  return (
    <div className="bg-paper pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="u-label flex flex-wrap items-center gap-1.5 text-ink-soft">
            <li>
              <Link href="/shop" className="hover:text-oxblood">
                The Arsenal
              </Link>
            </li>
            <ChevronRight className="size-3" aria-hidden="true" />
            <li>
              <Link
                href={`/shop?category=${product.category}`}
                className="hover:text-oxblood"
              >
                {category}
              </Link>
            </li>
            <ChevronRight className="size-3" aria-hidden="true" />
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <article className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative border border-ink/15 p-3">
              <p className="absolute -top-3 left-3 z-10 bg-oxblood px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
                {product.tag}
              </p>
              <div className="relative aspect-4/5 overflow-hidden bg-line">
                <Image
                  src={product.image}
                  alt={`${product.name} — ${category} at ${SITE.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <Kicker className="text-oxblood">{category}</Kicker>
            <h1 className="u-display mt-4 text-[clamp(2.5rem,6vw,4rem)]">
              {product.name}
            </h1>

            {product.brand && (
              <p className="u-label mt-3 text-ink-soft">By {product.brand}</p>
            )}

            <div className="mt-6 flex items-center gap-4">
              <p className="font-mono text-2xl text-oxblood">
                {formatPrice(product.price)}
              </p>
              <span
                className={`u-label border px-2 py-1 ${
                  product.inStock
                    ? "border-ink/30 text-ink-soft"
                    : "border-oxblood text-oxblood"
                }`}
              >
                {product.inStock ? "In Stock" : "Sold Out"}
              </span>
            </div>

            <p className="mt-6 max-w-prose leading-relaxed text-ink-soft">
              {product.blurb}
            </p>

            {product.mock && (
              <p className="u-label mt-4 text-ink-soft/70">
                Preview listing — final photography and pricing to follow.
              </p>
            )}

            <ProductBuyPanel product={product} />

            {/* Spec table */}
            <section className="mt-12">
              <h2 className="u-label text-gold">Technical Breakdown</h2>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                      {s.label}
                    </dt>
                    <dd className="font-mono text-sm">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Pickup */}
            <section className="mt-12 border border-line bg-paper-card p-6">
              <h2 className="u-display text-2xl">Pickup &amp; Reservation</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Reserve here and we&apos;ll set the piece aside. Collect and pay
                in person at the shop — we&apos;ll confirm on Facebook first.
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="u-label text-ink-soft">Location</dt>
                  <dd className="mt-1">{SITE.location.address}</dd>
                </div>
                <div>
                  <dt className="u-label text-ink-soft">Hours</dt>
                  <dd className="mt-1">{SITE.location.hours}</dd>
                </div>
              </dl>
              <a
                href={SITE.location.map}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label mt-5 inline-block border border-ink px-4 py-2 transition-colors hover:bg-ink hover:text-paper"
              >
                Get Directions ↗
              </a>
            </section>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-line pt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="u-display text-[clamp(2rem,5vw,3.5rem)]">
                More {category}
              </h2>
              <Link
                href="/shop"
                className="u-label text-ink-soft hover:text-oxblood"
              >
                All Gear ↗
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
