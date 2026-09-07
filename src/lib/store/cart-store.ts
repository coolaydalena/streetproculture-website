"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/lib/products";

/** The product + variant fields captured on a cart line at add-time. */
export type CartSnapshot = {
  productId: string;
  slug: string;
  name: string;
  tag: string;
  image: string;
  variantId: string;
  variantLabel: string;
  price: number; // whole PHP, the variant's price
};

/** A cart line is keyed on the variant id. */
export type CartLine = { id: string; qty: number; snapshot: CartSnapshot };

/** The resolved view of a cart line: live product/variant data when available, else the snapshot. */
export type DetailedLine = {
  product: CartSnapshot & { inStock: boolean };
  qty: number;
  lineTotal: number;
  /** true when the variant is no longer published / active / has been deleted. */
  unavailable: boolean;
};

type CartState = {
  lines: CartLine[];
  /** Live published catalogue, injected by <CartHydrator>. NOT persisted. */
  catalog: Product[];
  hydrated: boolean;
  setCatalog: (catalog: Product[]) => void;
  add: (product: Product, variant: ProductVariant, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

function variantImage(product: Product, variant: { imageId: string | null }): string {
  return (
    product.images.find((i) => i.id === variant.imageId)?.url ?? product.image
  );
}

function isValidLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const l = value as Record<string, unknown>;
  const s = l.snapshot as Record<string, unknown> | undefined;
  return (
    typeof l.id === "string" &&
    typeof l.qty === "number" &&
    l.qty > 0 &&
    !!s &&
    typeof s.productId === "string" &&
    typeof s.variantId === "string" &&
    typeof s.slug === "string" &&
    typeof s.name === "string" &&
    typeof s.price === "number"
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      catalog: [],
      hydrated: false,
      setCatalog: (catalog) => set({ catalog }),
      add: (product, variant, qty = 1) =>
        set((s) => {
          const snapshot: CartSnapshot = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            tag: product.tag,
            image: variantImage(product, variant),
            variantId: variant.id,
            variantLabel: variant.label,
            price: variant.price,
          };
          const existing = s.lines.find((l) => l.id === variant.id);
          return {
            lines: existing
              ? s.lines.map((l) =>
                  l.id === variant.id
                    ? { ...l, qty: l.qty + qty, snapshot }
                    : l,
                )
              : [...s.lines, { id: variant.id, qty, snapshot }],
          };
        }),
      setQty: (variantId, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.id === variantId ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (variantId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.id !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "spc-cart-v4",
      version: 4,
      partialize: (s) => ({ lines: s.lines }),
      migrate: (persisted): { lines: CartLine[] } => {
        // Pre-v4 lines have no variant id — drop them.
        const p = persisted as { lines?: unknown[] } | undefined;
        const raw = Array.isArray(persisted) ? persisted : p?.lines;
        return { lines: Array.isArray(raw) ? raw.filter(isValidLine) : [] };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.hydrated = true;
      },
    },
  ),
);

export type CartView = {
  lines: CartLine[];
  detailed: DetailedLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  hasUnavailable: boolean;
  add: CartState["add"];
  setQty: CartState["setQty"];
  remove: CartState["remove"];
  clear: CartState["clear"];
};

/**
 * Cart hook with the derived view (line details, subtotal, count) reconciled
 * against the live catalogue.
 */
export function useCart(): CartView {
  const lines = useCartStore((s) => s.lines);
  const catalog = useCartStore((s) => s.catalog);
  const hydrated = useCartStore((s) => s.hydrated);
  const add = useCartStore((s) => s.add);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  return useMemo<CartView>(() => {
    const detailed: DetailedLine[] = lines.map((l) => {
      const liveProduct = catalog.find((p) => p.id === l.snapshot.productId);
      const liveVariant = liveProduct?.variants.find(
        (v) => v.id === l.id && v.isActive,
      );
      const product =
        liveProduct && liveVariant
          ? {
              productId: liveProduct.id,
              slug: liveProduct.slug,
              name: liveProduct.name,
              tag: liveProduct.tag,
              image: variantImage(liveProduct, liveVariant),
              variantId: liveVariant.id,
              variantLabel: liveVariant.label,
              price: liveVariant.price,
              inStock: liveVariant.inStock,
            }
          : { ...l.snapshot, inStock: false };
      return {
        product,
        qty: l.qty,
        lineTotal: product.price * l.qty,
        unavailable: !liveVariant,
      };
    });

    return {
      lines,
      detailed,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: detailed.reduce((sum, l) => sum + l.lineTotal, 0),
      hydrated,
      hasUnavailable: detailed.some((l) => l.unavailable),
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, catalog, hydrated, add, setQty, remove, clear]);
}
