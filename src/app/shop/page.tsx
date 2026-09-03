import type { Metadata } from "next";
import { Kicker } from "@/components/ui/primitives";
import { ShopBrowser } from "@/components/shop/shop-browser";
import { isProductCategory, type ProductCategory } from "@/lib/products";
import { getPublishedProducts } from "@/lib/products-db";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Shop",
  description:
    "Caps, helmets, cases and merch from Street Pro Culture and the brands we carry — CGM Italia, NZI Fibra, X-land and OZ Racing.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "The Shop — Street Pro Culture",
    description:
      "Curated riding apparel, gear and lifestyle essentials. Multi-brand community-driven shop from the Philippines.",
    url: `${SITE_URL}/shop`,
    type: "website",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialFilter: ProductCategory | "all" =
    category && isProductCategory(category) ? category : "all";

  const products = await getPublishedProducts();

  return (
    <div className="bg-paper pt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Kicker className="text-oxblood">The Goldy Good Goods</Kicker>
        <h1 className="u-display mt-5 text-[clamp(3rem,10vw,8rem)]">The Shop</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Curated riding apparel, gears & lifestyle essentials. Multi-brand
          community-driven shop from the Philippines.
        </p>

        <div className="mt-12">
          <ShopBrowser initialFilter={initialFilter} products={products} />
        </div>
      </div>
    </div>
  );
}
