"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FlowStage = "closed" | "cart" | "checkout" | "confirmation";

export type PlacedOrder = {
  itemCount: number;
  total: number;
};

type FlowContextValue = {
  stage: FlowStage;
  lastOrder: PlacedOrder | null;
  openCart: () => void;
  goToCheckout: () => void;
  completeOrder: (order: PlacedOrder) => void;
  close: () => void;
};

const FlowContext = createContext<FlowContextValue | null>(null);

export function CheckoutFlowProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<FlowStage>("closed");
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

  const openCart = useCallback(() => setStage("cart"), []);
  const goToCheckout = useCallback(() => setStage("checkout"), []);
  const close = useCallback(() => setStage("closed"), []);
  const completeOrder = useCallback((order: PlacedOrder) => {
    setLastOrder(order);
    setStage("confirmation");
  }, []);

  const value = useMemo<FlowContextValue>(
    () => ({ stage, lastOrder, openCart, goToCheckout, completeOrder, close }),
    [stage, lastOrder, openCart, goToCheckout, completeOrder, close],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useCheckoutFlow(): FlowContextValue {
  const ctx = useContext(FlowContext);
  if (!ctx)
    throw new Error("useCheckoutFlow must be used within <CheckoutFlowProvider>");
  return ctx;
}
