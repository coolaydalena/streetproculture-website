import type { Metadata } from "next";
import { Kicker } from "@/components/ui/primitives";
import { ShopBrowser } from "@/components/shop/shop-browser";

export const metadata: Metadata = {
  title: "The Arsenal",
  description:
    "Caps, helmets, cases and merch from Street Pro Culture and the brands we carry — CGM Italia, NZI Fibra, X-land and OZ Racing.",
};

export default function ShopPage() {
  return (
    <div className="bg-paper pt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Kicker className="text-oxblood">The Shop</Kicker>
        <h1 className="u-display mt-5 text-[clamp(3rem,10vw,8rem)]">
          The Arsenal
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          A small line built in-house, plus fitted gear from the brands we stand
          behind. Reserve online — pay and pick up at the shop.
        </p>

        <div className="mt-12">
          <ShopBrowser />
        </div>
      </div>
    </div>
  );
}
