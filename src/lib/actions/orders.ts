"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PRODUCTS_TAG } from "@/lib/products-db";
import { nextStatuses, type OrderStatus } from "@/lib/orders";

export type OrderActionResult = { ok: boolean; error?: string };

/** Decrement tracked stock for a freshly-paid order (best-effort, guarded). */
async function decrementStockForOrder(orderId: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  const { data: items } = await admin
    .from("streetproculture_order_items")
    .select("product_id, quantity, track_inventory_at_purchase")
    .eq("order_id", orderId);

  const payload = (items ?? [])
    .filter((i) => i.track_inventory_at_purchase && i.product_id)
    .map((i) => ({ product_id: i.product_id, qty: i.quantity }));

  if (payload.length === 0) return;

  await admin.rpc("streetproculture_decrement_stock", { items: payload });
  revalidateTag(PRODUCTS_TAG, "max");
}

function revalidateOrder(id: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderActionResult> {
  await requireSuperadmin();
  const supabase = await createSupabaseServerClient();

  const { data: order, error } = await supabase
    .from("streetproculture_orders")
    .select("id, status, fulfilment, paid_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) return { ok: false, error: "Order not found." };

  const allowed = nextStatuses({
    status: order.status,
    fulfilment: order.fulfilment,
  });
  if (!allowed.includes(status)) {
    return {
      ok: false,
      error: `Cannot move a “${order.status}” order to “${status}”.`,
    };
  }

  const patch: Record<string, unknown> = { status };
  const enteringPaid = status === "paid" && order.status !== "paid";
  if (enteringPaid && !order.paid_at) patch.paid_at = new Date().toISOString();
  if (status === "cancelled") patch.cancelled_reason = "Cancelled by staff";

  const { error: upError } = await supabase
    .from("streetproculture_orders")
    .update(patch)
    .eq("id", id);

  if (upError) return { ok: false, error: upError.message };

  if (enteringPaid) await decrementStockForOrder(id);

  revalidateOrder(id);
  return { ok: true };
}

export async function markPaidAtShop(id: string): Promise<OrderActionResult> {
  return updateOrderStatus(id, "paid");
}

export async function cancelOrder(
  id: string,
  reason: string,
): Promise<OrderActionResult> {
  await requireSuperadmin();
  const supabase = await createSupabaseServerClient();

  const { data: order, error } = await supabase
    .from("streetproculture_orders")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) return { ok: false, error: "Order not found." };
  if (["completed", "cancelled", "expired"].includes(order.status)) {
    return { ok: false, error: "This order is already closed." };
  }

  const { error: upError } = await supabase
    .from("streetproculture_orders")
    .update({
      status: "cancelled",
      cancelled_reason: reason.trim().slice(0, 300) || "Cancelled by staff",
    })
    .eq("id", id);

  if (upError) return { ok: false, error: upError.message };

  revalidateOrder(id);
  return { ok: true };
}

export async function updateAdminNotes(
  id: string,
  notes: string,
): Promise<OrderActionResult> {
  await requireSuperadmin();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("streetproculture_orders")
    .update({ admin_notes: notes.trim().slice(0, 2000) || null })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidateOrder(id);
  return { ok: true };
}
