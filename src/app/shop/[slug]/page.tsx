import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { categoryLabel, getRelated, variantOnSale } from "@/lib/products";
import { getPublishedProductBySlug, getPublishedProducts } from "@/lib/products-db";
import {
  productJsonLd,
  productKeywords,
  productMetaDescription,
} from "@/lib/product-seo";
import { brandForName } from "@/lib/brands";
import { SITE, SITE_URL, formatPrice } from "@/lib/site";
import { Kicker } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductCard } from "@/components/shop/product-card";
import { ProductBuyPanel } from "@/components/shop/product-buy-panel";
import { ProductGallery } from "@/components/shop/product-gallery";

type Props = { params: Promise<{ slug: string }> };

/* Prerender the current catalogue; new products render on-demand (dynamicParams). */
export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return {};

  const description = productMetaDescription(product);
  const url = `${SITE_URL}/shop/${product.slug}`;

  return {
    title: product.name,
    description,
    keywords: productKeywords(product),
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${SITE.name}`,
      description,
      url,
      type: "website",
      // Image supplied by ./opengraph-image.tsx (file convention).
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${SITE.name}`,
      description,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) notFound();

  const related = getRelated(product, await getPublishedProducts());
  const category = categoryLabel(product.category);
  const brand = brandForName(product.brand);
  const activeVariants = product.variants.filter((v) => v.isActive);

  // Single-variant products have no variant table — surface the part number in
  // the spec list instead.
  const specs =
    activeVariants.length === 1 && activeVariants[0].sku
      ? [...product.specs, { label: "Article no.", value: activeVariants[0].sku }]
      : product.specs;

  const url = `${SITE_URL}/shop/${product.slug}`;
  const photoUrls = (
    product.images.filter((i) => i.mediaType === "image").length > 0
      ? product.images.filter((i) => i.mediaType === "image")
      : [{ url: product.image }]
  ).map((i) => (i.url.startsWith("http") ? i.url : `${SITE_URL}${i.url}`));

  const productLd = productJsonLd(product, {
    url,
    images: photoUrls,
    sellerName: SITE.name,
  });

  const breadcrumbLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "The Shop", item: `${SITE_URL}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: category,
        item: `${SITE_URL}/shop?category=${product.category}`,
      },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  return (
    <div className="bg-paper pt-16">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="u-label flex flex-wrap items-center gap-1.5 text-ink-soft">
            <li>
              <Link href="/shop" className="hover:text-oxblood">
                The Shop
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
            <ProductGallery
              productId={product.id}
              images={product.images}
              fallback={product.image}
              name={product.name}
              category={category}
              tag={product.tag}
            />
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

            <div className="mt-6">
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

            {product.blurb && (
              <p className="mt-6 max-w-prose leading-relaxed text-ink-soft">
                {product.blurb}
              </p>
            )}

            {product.isMock && (
              <p className="u-label mt-4 text-ink-soft/70">
                Preview listing — final photography and pricing to follow.
              </p>
            )}

            <ProductBuyPanel product={product} />

            {/* Description */}
            {product.description && (
              <section className="mt-12 max-w-prose space-y-4 leading-relaxed text-ink-soft">
                {product.description
                  .split(/\n{2,}/)
                  .map((para) => para.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </section>
            )}

            {/* Brand context */}
            {brand && (
              <section className="mt-12 border-l-2 border-oxblood/40 pl-4">
                <h2 className="u-label text-oxblood">
                  {brand.name}{" "}
                  <span className="text-ink-soft">· {brand.origin}</span>
                </h2>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
                  {brand.blurb}
                </p>
              </section>
            )}

            {/* Spec table */}
            {specs.length > 0 && (
              <section className="mt-12">
                <h2 className="u-label text-gold">Technical Breakdown</h2>
                <dl className="mt-4 divide-y divide-line border-y border-line">
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                        {s.label}
                      </dt>
                      <dd className="font-mono text-sm text-right">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Colourways & part numbers — only when there's a real choice */}
            {activeVariants.length > 1 && (
              <section className="mt-12">
                <h2 className="u-label text-gold">
                  {product.category === "cases"
                    ? "Sizes & part numbers"
                    : "Colourways & part numbers"}
                </h2>
                <div className="mt-4 overflow-x-auto border-y border-line">
                  <table className="w-full min-w-[28rem] text-sm">
                    <thead>
                      <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                        <th className="py-2 pr-4">
                          {product.category === "cases" ? "Size / colour" : "Colourway"}
                        </th>
                        <th className="py-2 pr-4">Part no.</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2">Availability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {activeVariants.map((v) => (
                        <tr key={v.id}>
                          <td className="py-2.5 pr-4">{v.label}</td>
                          <td className="py-2.5 pr-4 font-mono text-xs text-ink-soft">
                            {v.sku ?? "—"}
                          </td>
                          <td className="py-2.5 pr-4 font-mono">
                            {formatPrice(v.price)}
                            {variantOnSale(v) && v.compareAtPrice && (
                              <span className="ml-1.5 text-xs text-ink-soft line-through">
                                {formatPrice(v.compareAtPrice)}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5">
                            <span
                              className={
                                v.inStock ? "text-ink-soft" : "text-oxblood"
                              }
                            >
                              {v.inStock ? "In stock" : "Sold out"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Pickup / delivery */}
            <section className="mt-12 border border-line bg-paper-card p-6">
              <h2 className="u-display text-2xl">Pickup &amp; Delivery</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Check out online for pickup at the shop or delivery. Pay by card,
                GCash, Maya or GrabPay — or in person on collection.
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
