"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { useCart } from "@/lib/cart-context";
import { useCheckoutFlow } from "@/lib/checkout-flow";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { openCart } = useCheckoutFlow();
  const [added, setAdded] = useState(false);

  function quickAdd() {
    add(product.id);
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="group flex flex-col border border-line bg-paper-card">
      <div className="relative aspect-4/5 overflow-hidden bg-coal">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="u-label absolute left-3 top-3 bg-coal/85 px-2 py-1 text-paper">
          {product.tag}
        </span>

        {/* Technical breakdown — revealed on hover / focus */}
        <div className="absolute inset-0 flex flex-col justify-end bg-coal/85 p-5 text-paper opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="u-label text-gold">Technical Breakdown</p>
          <dl className="mt-3 divide-y divide-paper/15">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-1.5">
                <dt className="u-label text-paper/50">{s.label}</dt>
                <dd className="u-label text-paper">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="u-display text-2xl">{product.name}</h3>
          <p className="u-display text-xl text-oxblood">
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="mt-2 flex-1 text-sm text-ink-soft">{product.blurb}</p>
        {product.mock && (
          <p className="u-label mt-3 text-ink-soft/70">Preview listing</p>
        )}

        <button
          type="button"
          onClick={quickAdd}
          className="u-label mt-5 flex items-center justify-center gap-2 border border-ink py-3 transition-colors hover:bg-ink hover:text-paper"
        >
          {added ? (
            <>
              <Check className="size-3.5" strokeWidth={3} /> Added
            </>
          ) : (
            <>
              <Plus className="size-3.5" strokeWidth={3} /> Quick Add
            </>
          )}
        </button>
      </div>
    </article>
  );
}
