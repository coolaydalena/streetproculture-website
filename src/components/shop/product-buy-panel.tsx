"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useCheckoutFlow } from "@/lib/checkout-flow";

/*
  Buy box for the product detail page. The surrounding page is a Server
  Component; this island owns the quantity state and the cart wiring.
*/
export function ProductBuyPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const { openCart } = useCheckoutFlow();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function reserve() {
    add(product.id, qty);
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="mt-8 border-t border-line pt-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-ink">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-3 transition-colors hover:bg-ink hover:text-paper"
          >
            <Minus className="size-3.5" strokeWidth={3} />
          </button>
          <span className="u-label w-10 text-center tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(9, q + 1))}
            className="p-3 transition-colors hover:bg-ink hover:text-paper"
          >
            <Plus className="size-3.5" strokeWidth={3} />
          </button>
        </div>

        <button
          type="button"
          onClick={reserve}
          disabled={!product.inStock}
          className="u-label flex-1 border border-oxblood bg-oxblood px-6 py-4 text-paper transition-colors hover:bg-oxblood-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added
            ? "Added to Cart"
            : product.inStock
              ? "Reserve This"
              : "Out of Stock"}
        </button>
      </div>

      <p className="u-label mt-4 text-ink-soft">
        Reserve online — pay and pick up at the shop. Cash or card on collection.
      </p>
    </div>
  );
}
