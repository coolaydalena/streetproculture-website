"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";

/**
 * Runs on the /checkout/success page: empties the cart, and — while the order
 * is still awaiting the PayMongo webhook — refreshes the server component a few
 * times so the confirmed state appears without a manual reload.
 */
export function CheckoutReturn({
  awaitingPayment,
}: {
  awaitingPayment: boolean;
}) {
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);
  const tries = useRef(0);

  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (!awaitingPayment) return;
    const id = setInterval(() => {
      tries.current += 1;
      if (tries.current > 10) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, 4000);
    return () => clearInterval(id);
  }, [awaitingPayment, router]);

  return null;
}
