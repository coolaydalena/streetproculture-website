"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/products";

/** The product fields captured on a cart line at add-time. */
export type CartSnapshot = Pick<
  Product,
  "id" | "slug" | "name" | "tag" | "image" | "price"
>;

export type CartLine = { id: string; qty: number; snapshot: CartSnapshot };

/** The resolved view of a cart line: live product data when available, else the snapshot. */
export type DetailedLine = {
  product: CartSnapshot & { inStock: boolean };
  qty: number;
  lineTotal: number;
  /** true when the product is no longer published / has been deleted. */
  unavailable: boolean;
};

type CartState = {
  lines: CartLine[];
  /** Live published catalogue, injected by <CartHydrator>. NOT persisted. */
  catalog: Product[];
  hydrated: boolean;
  setCatalog: (catalog: Product[]) => void;
  add: (product: CartSnapshot, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const LEGACY_KEY = "spc-cart-v2";

function isValidLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const l = value as Record<string, unknown>;
  const s = l.snapshot as Record<string, unknown> | undefined;
  return (
    typeof l.id === "string" &&
    typeof l.qty === "number" &&
    l.qty > 0 &&
    !!s &&
    typeof s.id === "string" &&
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
      add: (product, qty = 1) =>
        set((s) => {
          const snapshot: CartSnapshot = {
            id: product.id,
            slug: product.slug,
            name: product.name,
            tag: product.tag,
            image: product.image,
            price: product.price,
          };
          const existing = s.lines.find((l) => l.id === snapshot.id);
          return {
            lines: existing
              ? s.lines.map((l) =>
                  l.id === snapshot.id
                    ? { ...l, qty: l.qty + qty, snapshot }
                    : l,
                )
              : [...s.lines, { id: snapshot.id, qty, snapshot }],
          };
        }),
      setQty: (id, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.id === id ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "spc-cart-v3",
      version: 3,
      partialize: (s) => ({ lines: s.lines }),
      migrate: (persisted): { lines: CartLine[] } => {
        if (Array.isArray(persisted)) {
          return { lines: persisted.filter(isValidLine) };
        }
        const p = persisted as { lines?: unknown[] } | undefined;
        return {
          lines: Array.isArray(p?.lines) ? p.lines.filter(isValidLine) : [],
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // One-time pull from the pre-zustand cart (a bare array under spc-cart-v2).
        if (state.lines.length === 0) {
          try {
            const legacy = localStorage.getItem(LEGACY_KEY);
            if (legacy) {
              const parsed: unknown = JSON.parse(legacy);
              if (Array.isArray(parsed)) state.lines = parsed.filter(isValidLine);
            }
          } catch {
            /* ignore */
          }
        }
        try {
          localStorage.removeItem(LEGACY_KEY);
        } catch {
          /* ignore */
        }
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
 * against the live catalogue. Same shape the old CartProvider exposed.
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
      const live = catalog.find((p) => p.id === l.id);
      const product = live
        ? {
            id: live.id,
            slug: live.slug,
            name: live.name,
            tag: live.tag,
            image: live.image,
            price: live.price,
            inStock: live.inStock,
          }
        : { ...l.snapshot, inStock: false };
      return {
        product,
        qty: l.qty,
        lineTotal: product.price * l.qty,
        unavailable: !live,
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
