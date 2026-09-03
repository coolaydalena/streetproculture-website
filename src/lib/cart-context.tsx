"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/lib/products";

export type CartLine = { id: string; qty: number };

type State = { lines: CartLine[]; hydrated: boolean };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; id: string; qty?: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

const STORAGE_KEY = "spc-cart-v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.lines.find((l) => l.id === action.id);
      const lines = existing
        ? state.lines.map((l) =>
            l.id === action.id ? { ...l, qty: l.qty + qty } : l,
          )
        : [...state.lines, { id: action.id, qty }];
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

export type DetailedLine = { product: Product; qty: number; lineTotal: number };

type CartContextValue = {
  lines: CartLine[];
  detailed: DetailedLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: CartLine[] = raw ? JSON.parse(raw) : [];
      const clean = Array.isArray(parsed)
        ? parsed.filter(
            (l) =>
              l &&
              typeof l.id === "string" &&
              typeof l.qty === "number" &&
              PRODUCTS.some((p) => p.id === l.id),
          )
        : [];
      dispatch({ type: "hydrate", lines: clean });
    } catch {
      dispatch({ type: "hydrate", lines: [] });
    }
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
    const detailed: DetailedLine[] = state.lines
      .map((l) => {
        const product = PRODUCTS.find((p) => p.id === l.id);
        if (!product) return null;
        return { product, qty: l.qty, lineTotal: product.price * l.qty };
      })
      .filter((x): x is DetailedLine => x !== null);

    return {
      lines: state.lines,
      detailed,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      subtotal: detailed.reduce((s, l) => s + l.lineTotal, 0),
      hydrated: state.hydrated,
      add: (id, qty) => dispatch({ type: "add", id, qty }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
