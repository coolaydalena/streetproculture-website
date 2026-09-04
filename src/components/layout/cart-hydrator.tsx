"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/lib/store/cart-store";

/**
 * Feeds the live published catalogue into the cart store so cart lines can be
 * reconciled against current prices / stock. Rendered once in the root layout.
 */
export function CartHydrator({ products }: { products: Product[] }) {
  const setCatalog = useCartStore((s) => s.setCatalog);

  useEffect(() => {
    setCatalog(products);
  }, [products, setCatalog]);

  return null;
}
