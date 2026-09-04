import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { categoryLabel, getRelated } from "@/lib/products";
import { getPublishedProductBySlug, getPublishedProducts } from "@/lib/products-db";
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

  const url = `${SITE_URL}/shop/${product.slug}`;
  const image = product.image.startsWith("http")
    ? product.image
    : `${SITE_URL}${product.image}`;

  return {
    title: product.name,
    description: product.blurb,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${SITE.name}`,
      description: product.blurb,
      url,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${SITE.name}`,
      description: product.blurb,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) notFound();

  const related = getRelated(product, await getPublishedProducts());
  const category = categoryLabel(product.category);

  const url = `${SITE_URL}/shop/${product.slug}`;
  const images = (product.images.length > 0 ? product.images : [{ url: product.image }]).map(
    (i) => (i.url.startsWith("http") ? i.url : `${SITE_URL}${i.url}`),
  );

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    image: images,
    sku: product.slug,
    category,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PHP",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };

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

            {product.isMock && (
              <p className="u-label mt-4 text-ink-soft/70">
                Preview listing — final photography and pricing to follow.
              </p>
            )}

            <ProductBuyPanel product={product} />

            {/* Spec table */}
            {product.specs.length > 0 && (
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
