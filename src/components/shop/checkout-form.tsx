"use client";

import { useState, type FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCheckoutFlow } from "@/lib/checkout-flow";
import { CHECKOUT_ENABLED, formatPrice } from "@/lib/site";

type Fulfilment = "pickup" | "delivery";

export function CheckoutForm() {
  const { detailed, subtotal, count, clear } = useCart();
  const { openCart, completeOrder } = useCheckoutFlow();
  const [fulfilment, setFulfilment] = useState<Fulfilment>("pickup");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!CHECKOUT_ENABLED) return;
    completeOrder({ itemCount: count, total: subtotal });
    clear();
  }

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex items-start justify-between border-b border-line p-5">
        <div>
          <button
            type="button"
            onClick={openCart}
            className="u-label inline-flex items-center gap-1 text-ink-soft hover:text-ink"
          >
            <ChevronLeft className="size-3.5" /> Back to Cart
          </button>
          <p className="u-display mt-2 text-3xl">Final Check</p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <Field label="Full Name" name="name" placeholder="Juan Dela Cruz" required autoComplete="name" />
        <Field label="Email" name="email" type="email" placeholder="juan@example.com" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" placeholder="0917 000 0000" required autoComplete="tel" />

        <div>
          <span className="u-label text-ink-soft">Fulfilment</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["pickup", "delivery"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFulfilment(f)}
                className={`u-label border py-3 capitalize transition-colors ${
                  fulfilment === f
                    ? "border-oxblood bg-oxblood text-paper"
                    : "border-line hover:border-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Field
          label={fulfilment === "pickup" ? "Notes for Pickup" : "Delivery Address"}
          name="address"
          placeholder={fulfilment === "pickup" ? "Preferred day / time" : "Street, Barangay"}
          required={fulfilment === "delivery"}
          autoComplete="street-address"
        />
        {fulfilment === "delivery" && (
          <Field label="City / Municipality" name="city" placeholder="City" required autoComplete="address-level2" />
        )}

        <div className="border border-line">
          <p className="u-label border-b border-line p-3 text-oxblood">
            Order Summary
          </p>
          <ul className="divide-y divide-line">
            {detailed.map(({ product, qty, lineTotal }) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 p-3 text-sm"
              >
                <span>
                  {product.name} <span className="text-ink-soft">× {qty}</span>
                </span>
                <span className="u-display text-base">{formatPrice(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-line p-3">
            <span className="u-label">Subtotal</span>
            <span className="u-display text-xl">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-5">
        {!CHECKOUT_ENABLED && (
          <p className="u-label mb-3 text-ink-soft">
            Online payment via Paymongo — coming soon. Message us on Facebook to
            reserve.
          </p>
        )}
        <button
          type="submit"
          disabled={!CHECKOUT_ENABLED || count === 0}
          className="u-label w-full bg-oxblood py-4 text-paper transition-colors hover:bg-oxblood-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Place Order — {formatPrice(subtotal)}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="u-label text-ink-soft">{label}</span>
      <input
        {...props}
        className="mt-2 w-full border border-line bg-paper-card px-3 py-2.5 text-sm outline-none focus:border-oxblood"
      />
    </label>
  );
}
