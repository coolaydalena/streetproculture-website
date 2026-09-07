"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  discountPercent,
  variantOnSale,
  type Product,
} from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { useCartStore } from "@/lib/store/cart-store";
import { useCartUI } from "@/lib/store/cart-ui-store";
import { usePdpStore } from "@/lib/store/pdp-store";

/*
  Buy box for the product detail page. The surrounding page is a Server
  Component; this island owns the variant + quantity state and the cart wiring.
*/
export function ProductBuyPanel({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const openCart = useCartUI((s) => s.openCart);
  const selectMedia = usePdpStore((s) => s.select);

  const variants = useMemo(
    () => product.variants.filter((v) => v.isActive),
    [product.variants],
  );

  const [variantId, setVariantId] = useState(
    product.defaultVariant?.id ?? variants[0]?.id ?? "",
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = variants.find((v) => v.id === variantId) ?? null;
  const multi = variants.length > 1;

  function choose(id: string) {
    setVariantId(id);
    const v = variants.find((x) => x.id === id);
    if (v?.imageId) selectMedia(product.id, v.imageId);
  }

  function addToCart() {
    if (!selected) return;
    add(product, selected, qty);
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1400);
  }

  const price = selected?.price ?? product.priceFrom;
  const onSale = selected ? variantOnSale(selected) : false;

  return (
    <div className="mt-8 border-t border-line pt-8">
      {/* Price */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-2xl text-oxblood">{formatPrice(price)}</p>
        {onSale && selected?.compareAtPrice && (
          <>
            <span className="font-mono text-lg text-ink-soft line-through">
              {formatPrice(selected.compareAtPrice)}
            </span>
            <span className="u-label bg-oxblood px-2 py-1 text-paper">
              −{discountPercent(selected)}%
            </span>
          </>
        )}
      </div>

      {/* Variant picker */}
      {multi && (
        <div className="mt-6">
          <p className="u-label text-ink-soft">
            Variant{selected ? `: ${selected.label}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((v) => {
              const soldOut = !v.inStock;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => choose(v.id)}
                  aria-pressed={v.id === variantId}
                  className={`u-label border px-3 py-2 transition-colors ${
                    v.id === variantId
                      ? "border-oxblood bg-oxblood text-paper"
                      : "border-line hover:border-ink"
                  } ${soldOut ? "opacity-40" : ""}`}
                >
                  {v.label}
                  {soldOut ? " · Sold out" : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + add */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
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
          onClick={addToCart}
          disabled={!selected || !selected.inStock}
          className="u-label flex-1 border border-oxblood bg-oxblood px-6 py-4 text-paper transition-colors hover:bg-oxblood-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added
            ? "Added to Cart"
            : !selected
              ? "Select a variant"
              : selected.inStock
                ? "Add to Cart"
                : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
