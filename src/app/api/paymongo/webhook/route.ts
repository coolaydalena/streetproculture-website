import { revalidateTag } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PRODUCTS_TAG } from "@/lib/products-db";
import {
  PAYMONGO_MERCHANT_ID,
  readPaidEvent,
  verifyWebhookSignature,
  type PayMongoWebhookEvent,
} from "@/lib/paymongo";

// Needs node:crypto + the service-role client, and must never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OK = () => new Response("ok", { status: 200 });

/* eslint-disable @typescript-eslint/no-explicit-any */
async function findOrder(admin: any, info: ReturnType<typeof readPaidEvent>) {
  const tryBy = async (column: string, value?: string) => {
    if (!value) return null;
    const { data } = await admin
      .from("streetproculture_orders")
      .select("id, status")
      .eq(column, value)
      .maybeSingle();
    return data ?? null;
  };

  return (
    (await tryBy("id", info.orderId)) ||
    (await tryBy("public_token", info.publicToken)) ||
    (await tryBy("order_number", info.referenceNumber)) ||
    (await tryBy("paymongo_checkout_session_id", info.checkoutSessionId))
  );
}

async function decrementStock(admin: any, orderId: string) {
  const { data: items } = await admin
    .from("streetproculture_order_items")
    .select("product_id, quantity, track_inventory_at_purchase")
    .eq("order_id", orderId);

  const payload = (items ?? [])
    .filter((i: any) => i.track_inventory_at_purchase && i.product_id)
    .map((i: any) => ({ product_id: i.product_id, qty: i.quantity }));

  if (payload.length > 0) {
    await admin.rpc("streetproculture_decrement_stock", { items: payload });
    revalidateTag(PRODUCTS_TAG, "max");
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("paymongo-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return new Response("invalid signature", { status: 400 });
  }

  let evt: PayMongoWebhookEvent;
  try {
    evt = JSON.parse(raw);
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const eventId = evt.data?.id;
  const eventType = evt.data?.attributes?.type;
  if (!eventId || !eventType) return OK();

  const merchantId = evt.data?.attributes?.data?.attributes?.metadata?.merchant_id;
  if (merchantId !== PAYMONGO_MERCHANT_ID) return OK();

  const admin = createSupabaseAdminClient();

  // Idempotency — the unique paymongo_event_id makes a replay a no-op.
  const { data: logRow, error: logError } = await admin
    .from("streetproculture_payment_events")
    .insert({
      paymongo_event_id: eventId,
      event_type: eventType,
      signature_verified: true,
      payload: evt,
    })
    .select("id")
    .maybeSingle();

  if (logError) {
    // 23505 = already logged → already handled. Anything else → let PayMongo retry.
    if ((logError as { code?: string }).code === "23505") return OK();
    return new Response("log insert failed", { status: 500 });
  }
  if (!logRow) return OK();

  let orderId: string | null = null;
  let processingError: string | null = null;

  try {
    const info = readPaidEvent(evt);

    if (
      eventType === "checkout_session.payment.paid" ||
      eventType === "payment.paid"
    ) {
      const order = await findOrder(admin, info);
      if (!order) {
        processingError = "order not found for paid event";
      } else {
        orderId = order.id;
        if (order.status === "pending_payment") {
          await admin
            .from("streetproculture_orders")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              paymongo_payment_id: info.paymentId ?? null,
              paymongo_fee_actual_centavos: info.feeCentavos ?? null,
            })
            .eq("id", order.id)
            .eq("status", "pending_payment");

          await decrementStock(admin, order.id);
        }
      }
    } else if (eventType === "payment.failed") {
      const order = await findOrder(admin, info);
      if (order) {
        orderId = order.id;
        await admin
          .from("streetproculture_orders")
          .update({ payment_failed_at: new Date().toISOString() })
          .eq("id", order.id)
          .eq("status", "pending_payment");
      }
    } else if (eventType === "checkout_session.expired") {
      const order = await findOrder(admin, info);
      if (order) {
        orderId = order.id;
        await admin
          .from("streetproculture_orders")
          .update({ status: "expired" })
          .eq("id", order.id)
          .eq("status", "pending_payment");
      }
    }
  } catch (e) {
    processingError = e instanceof Error ? e.message : "processing error";
  }

  await admin
    .from("streetproculture_payment_events")
    .update({
      order_id: orderId,
      processed_at: new Date().toISOString(),
      processing_error: processingError,
    })
    .eq("id", logRow.id);

  return OK();
}
