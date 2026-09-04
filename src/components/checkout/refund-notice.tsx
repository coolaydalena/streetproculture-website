import Link from "next/link";

/**
 * Minimal refund-policy line. Shown before payment on /checkout and on order
 * pages: only the item price is refundable — the service fee is not.
 */
export function RefundNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] italic leading-relaxed text-ink-soft ${className}`}>
      *Only the price of the items is refundable — the service fee is
      non-refundable.{" "}
      <Link
        href="/refund-policy"
        className="underline underline-offset-2 hover:text-ink"
      >
        Refund policy
      </Link>
    </p>
  );
}
