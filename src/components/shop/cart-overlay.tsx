"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/store/cart-store";
import { useCartUI } from "@/lib/store/cart-ui-store";
import { formatPrice } from "@/lib/site";

export function CartOverlay() {
  const open = useCartUI((s) => s.open);
  const closeCart = useCartUI((s) => s.closeCart);
  const pathname = usePathname();

  // Close the drawer on navigation (e.g. after "Proceed to Checkout").
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeCart]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-coal/60 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-paper text-ink shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
          >
            <CartPanel />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartPanel() {
  const { detailed, subtotal, setQty, remove, count, hasUnavailable } = useCart();
  const closeCart = useCartUI((s) => s.closeCart);

  return (
    <>
      <div className="flex items-start justify-between border-b border-line p-5">
        <div>
          <p className="u-label text-oxblood">Your Haul</p>
          <p className="u-display mt-1 text-3xl">The Cart</p>
        </div>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Close"
          className="p-1"
        >
          <X className="size-5" />
        </button>
      </div>

      {detailed.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="u-label text-ink-soft">Nothing loaded up yet.</p>
          <Link
            href="/shop"
            onClick={closeCart}
            className="u-label border border-ink px-5 py-3 hover:bg-ink hover:text-paper"
          >
            Browse the Arsenal
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto">
            {detailed.map(({ product, qty, lineTotal, unavailable }) => (
              <li key={product.id} className="flex gap-4 p-5">
                <div className="relative size-20 shrink-0 overflow-hidden bg-coal">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="u-label text-ink-soft">{product.tag}</p>
                  <p className="u-display text-lg leading-tight">{product.name}</p>
                  {unavailable ? (
                    <p className="text-sm text-oxblood">No longer available</p>
                  ) : (
                    <p className="text-sm text-ink-soft">
                      {formatPrice(product.price)}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(product.id, qty - 1)}
                        className="p-2 hover:bg-line"
                      >
                        <Minus className="size-3" strokeWidth={3} />
                      </button>
                      <span className="u-label w-8 text-center tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(product.id, qty + 1)}
                        className="p-2 hover:bg-line"
                      >
                        <Plus className="size-3" strokeWidth={3} />
                      </button>
                    </div>
                    <span className="u-display text-lg">
                      {formatPrice(lineTotal)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="u-label mt-2 self-start text-ink-soft underline-offset-2 hover:text-oxblood hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line p-5">
            <div className="flex items-center justify-between">
              <span className="u-label">Subtotal</span>
              <span className="u-display text-2xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] italic leading-relaxed text-ink-soft mt-4 border-t border-line pt-4">
              * Fees and delivery are calculated at checkout.
            </p>
            {hasUnavailable && (
              <p className="u-label mt-2 text-oxblood">
                Remove unavailable items to continue.
              </p>
            )}
            {count === 0 || hasUnavailable ? (
              <button
                type="button"
                disabled
                className="u-label mt-4 w-full bg-oxblood py-4 text-paper opacity-40"
              >
                Proceed to Checkout
              </button>
            ) : (
              <Link
                href="/checkout"
                onClick={closeCart}
                className="u-label mt-4 block w-full bg-oxblood py-4 text-center text-paper transition-colors hover:bg-oxblood-deep"
              >
                Proceed to Checkout
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
}
