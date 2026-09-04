"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  cancelOrder,
  updateAdminNotes,
  updateOrderStatus,
} from "@/lib/actions/orders";
import {
  ORDER_STATUS_LABELS,
  nextStatuses,
  type Fulfilment,
  type OrderStatus,
} from "@/lib/order-status";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function OrderControls({
  orderId,
  status,
  fulfilment,
  adminNotes,
}: {
  orderId: string;
  status: OrderStatus;
  fulfilment: Fulfilment;
  adminNotes: string | null;
}) {
  const router = useRouter();
  const { push } = useToast();
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState(adminNotes ?? "");

  const moves = nextStatuses({ status, fulfilment }).filter(
    (s) => s !== "cancelled",
  );

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, okMsg: string) {
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        push(okMsg, "success");
        router.refresh();
      } else {
        push(res.error ?? "Something went wrong", "error");
      }
    });
  }

  function onCancel() {
    const reason = window.prompt("Reason for cancelling this order?");
    if (reason === null) return;
    run(() => cancelOrder(orderId, reason), "Order cancelled");
  }

  return (
    <div className="space-y-6 border border-line bg-paper-card p-5">
      <div>
        <p className="u-label text-oxblood">Update status</p>
        <p className="mt-1 text-sm text-ink-soft">
          Currently {ORDER_STATUS_LABELS[status].toLowerCase()}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {moves.length === 0 && (
            <p className="text-sm text-ink-soft">No further steps.</p>
          )}
          {moves.map((s) => (
            <button
              key={s}
              type="button"
              disabled={pending}
              onClick={() =>
                run(
                  () => updateOrderStatus(orderId, s),
                  `Marked ${ORDER_STATUS_LABELS[s].toLowerCase()}`,
                )
              }
              className="u-label border border-ink px-4 py-2 transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              {s === "paid" ? "Mark collected / paid" : ORDER_STATUS_LABELS[s]}
            </button>
          ))}
          {nextStatuses({ status, fulfilment }).includes("cancelled") && (
            <button
              type="button"
              disabled={pending}
              onClick={onCancel}
              className="u-label border border-oxblood px-4 py-2 text-oxblood transition-colors hover:bg-oxblood hover:text-paper disabled:opacity-40"
            >
              Cancel order
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-line pt-5">
        <label className="u-label text-oxblood" htmlFor="admin-notes">
          Internal notes
        </label>
        <textarea
          id="admin-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-oxblood"
        />
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          className="mt-2"
          onClick={() =>
            run(() => updateAdminNotes(orderId, notes), "Notes saved")
          }
        >
          Save notes
        </Button>
      </div>
    </div>
  );
}
