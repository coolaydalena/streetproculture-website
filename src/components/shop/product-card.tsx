"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { useCart } from "@/lib/cart-context";
import { useCheckoutFlow } from "@/lib/checkout-flow";

/*
  Non-uniform shop grid — ported from the base44 prototype.
  Card height varies by two cycling rules keyed to the card's position:
  a staggered top offset, and a rotating image aspect ratio.
*/
const OFFSETS = ["sm:mt-0", "sm:mt-12"];
const ASPECTS = [
  "aspect-3/4",
  "aspect-4/3",
  "aspect-3/4",
  "aspect-4/5",
  "aspect-3/4",
  "aspect-4/3",
];

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { add } = useCart();
  const { openCart } = useCheckoutFlow();
  const [added, setAdded] = useState(false);

  const offset = OFFSETS[index % OFFSETS.length];
  const aspect = ASPECTS[index % ASPECTS.length];

  function quickAdd() {
    add(product);
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className={`group ${offset}`}>
      <div className="relative border border-ink/15 p-3">
        <p className="absolute -top-3 left-3 z-10 bg-oxblood px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
          {product.tag}
        </p>

        <Link
          href={`/shop/${product.slug}`}
          aria-label={product.name}
          className={`relative block overflow-hidden bg-line ${aspect}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Technical breakdown — slides up on hover / focus */}
          <div className="absolute inset-0 flex translate-y-full flex-col justify-between gap-6 bg-ink/95 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                Technical Breakdown
              </p>
              <p className="u-display mt-1 text-2xl text-paper">{product.name}</p>
            </div>
            <ul className="space-y-2">
              {product.specs.map((s) => (
                <li
                  key={s.label}
                  className="flex justify-between gap-4 border-b border-paper/20 pb-2 font-mono text-[10px] uppercase tracking-wider text-paper/70"
                >
                  <span>{s.label}</span>
                  <span className="text-paper">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/20 pt-3">
        <h3 className="u-display text-2xl">
          <Link href={`/shop/${product.slug}`} className="hover:text-oxblood">
            {product.name}
          </Link>
        </h3>
        <p className="font-mono text-lg text-oxblood">{formatPrice(product.price)}</p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">{product.blurb}</p>
      {product.isMock && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft/70">
          Preview listing
        </p>
      )}

      <button
        type="button"
        onClick={quickAdd}
        className="mt-4 flex w-full items-center justify-center gap-2 border border-ink py-3 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-ink hover:text-paper"
      >
        <Plus className="size-3.5" strokeWidth={3} /> {added ? "Added" : "Quick Add"}
      </button>
    </article>
  );
}
