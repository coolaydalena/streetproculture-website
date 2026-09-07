"use client";

import { create } from "zustand";

/**
 * Shared selection state for a single product detail page — lets the variant
 * picker (in <ProductBuyPanel>) drive which media <ProductGallery> shows.
 * Keyed by product id so a stale selection never leaks across navigation.
 */
type PdpState = {
  productId: string | null;
  activeMediaId: string | null;
  select: (productId: string, mediaId: string | null) => void;
};

export const usePdpStore = create<PdpState>((set) => ({
  productId: null,
  activeMediaId: null,
  select: (productId, activeMediaId) => set({ productId, activeMediaId }),
}));
