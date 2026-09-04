"use client";

import { create } from "zustand";

/** The cart slide-over's open/closed state (replaces the old checkout-flow context). */
type CartUIState = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
};

export const useCartUI = create<CartUIState>((set) => ({
  open: false,
  openCart: () => set({ open: true }),
  closeCart: () => set({ open: false }),
}));
