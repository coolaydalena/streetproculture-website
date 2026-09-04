import { formatCentavos } from "@/lib/money";

type Props = {
  subtotalCentavos: number;
  serviceFeeCentavos: number;
  deliveryFeeCentavos: number;
  totalCentavos: number;
  /** Optional split of the service fee, shown as a hint. */
  ownFeeCentavos?: number;
  paymongoFeeCentavos?: number;
  className?: string;
};

/** The money breakdown shown on /checkout and on order pages. */
export function OrderBreakdown({
  subtotalCentavos,
  serviceFeeCentavos,
  deliveryFeeCentavos,
  totalCentavos,
  ownFeeCentavos,
  paymongoFeeCentavos,
  className = "",
}: Props) {
  const showFeeHint =
    typeof ownFeeCentavos === "number" &&
    typeof paymongoFeeCentavos === "number" &&
    paymongoFeeCentavos > 0;

  return (
    <dl className={`space-y-2 text-sm ${className}`}>
      <div className="flex items-center justify-between">
        <dt className="text-ink-soft">Subtotal</dt>
        <dd className="font-mono">{formatCentavos(subtotalCentavos)}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-ink-soft">
          Service Fee
          {showFeeHint && false && (
            <span className="ml-1 text-xs text-ink-soft/70">
              (handling {formatCentavos(ownFeeCentavos!)} + processing{" "}
              {formatCentavos(paymongoFeeCentavos!)})
            </span>
          )}
        </dt>
        <dd className="font-mono">{formatCentavos(serviceFeeCentavos)}</dd>
      </div>
      {deliveryFeeCentavos > 0 && (
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Delivery Fee</dt>
          <dd className="font-mono">{formatCentavos(deliveryFeeCentavos)}</dd>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-line pt-2">
        <dt className="u-label">Total</dt>
        <dd className="u-display text-xl">{formatCentavos(totalCentavos)}</dd>
      </div>
    </dl>
  );
}
