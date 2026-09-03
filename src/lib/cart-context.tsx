"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

/** The product fields captured on a cart line at add-time. */
export type CartSnapshot = Pick<
  Product,
  "id" | "slug" | "name" | "tag" | "image" | "price"
>;

export type CartLine = { id: string; qty: number; snapshot: CartSnapshot };

type State = { lines: CartLine[]; hydrated: boolean };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; snapshot: CartSnapshot; qty: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

const STORAGE_KEY = "spc-cart-v2";
const LEGACY_STORAGE_KEY = "spc-cart-v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      const existing = state.lines.find((l) => l.id === action.snapshot.id);
      const lines = existing
        ? state.lines.map((l) =>
            l.id === action.snapshot.id
              ? { ...l, qty: l.qty + action.qty, snapshot: action.snapshot }
              : l,
          )
        : [
            ...state.lines,
            { id: action.snapshot.id, qty: action.qty, snapshot: action.snapshot },
          ];
      return { ...state, lines };
    }
    case "setQty": {
      const lines = state.lines
        .map((l) => (l.id === action.id ? { ...l, qty: action.qty } : l))
        .filter((l) => l.qty > 0);
      return { ...state, lines };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

function isSnapshot(value: unknown): value is CartSnapshot {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.slug === "string" &&
    typeof s.name === "string" &&
    typeof s.price === "number"
  );
}

/** The resolved view of a cart line: live product data when available, else the snapshot. */
export type DetailedLine = {
  product: CartSnapshot & { inStock: boolean };
  qty: number;
  lineTotal: number;
  /** true when the product is no longer published / has been deleted. */
  unavailable: boolean;
};

type CartContextValue = {
  lines: CartLine[];
  detailed: DetailedLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  hasUnavailable: boolean;
  add: (product: CartSnapshot, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  useEffect(() => {
    try {
      const rawV2 = localStorage.getItem(STORAGE_KEY);
      if (rawV2) {
        const parsed: unknown = JSON.parse(rawV2);
        const lines = Array.isArray(parsed)
          ? parsed.filter(
              (l): l is CartLine =>
                l &&
                typeof l.id === "string" &&
                typeof l.qty === "number" &&
                l.qty > 0 &&
                isSnapshot(l.snapshot),
            )
          : [];
        dispatch({ type: "hydrate", lines });
        return;
      }

      // One-time migration from the pre-Supabase cart format.
      const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (rawV1) {
        const parsed: unknown = JSON.parse(rawV1);
        const migrated: CartLine[] = Array.isArray(parsed)
          ? parsed.flatMap((l) => {
              if (!l || typeof l.id !== "string" || typeof l.qty !== "number") {
                return [];
              }
              const p = products.find((prod) => prod.id === l.id);
              if (!p) return [];
              return [
                {
                  id: p.id,
                  qty: l.qty,
                  snapshot: {
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    tag: p.tag,
                    image: p.image,
                    price: p.price,
                  },
                },
              ];
            })
          : [];
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        dispatch({ type: "hydrate", lines: migrated });
        return;
      }

      dispatch({ type: "hydrate", lines: [] });
    } catch {
      dispatch({ type: "hydrate", lines: [] });
    }
    // products is only needed for the one-time migration; re-running is harmless
    // but unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* storage unavailable — cart stays in-memory only */
    }
  }, [state.lines, state.hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const detailed: DetailedLine[] = state.lines.map((l) => {
      const live = products.find((p) => p.id === l.id);
      const view = live
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
        product: view,
        qty: l.qty,
        lineTotal: view.price * l.qty,
        unavailable: !live,
      };
    });

    return {
      lines: state.lines,
      detailed,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      subtotal: detailed.reduce((s, l) => s + l.lineTotal, 0),
      hydrated: state.hydrated,
      hasUnavailable: detailed.some((l) => l.unavailable),
      add: (product, qty = 1) =>
        dispatch({
          type: "add",
          snapshot: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            tag: product.tag,
            image: product.image,
            price: product.price,
          },
          qty,
        }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
