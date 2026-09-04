import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/order-status";

export * from "@/lib/order-status";

const ORDER_COLUMNS = `
  id, order_number, public_token, user_id, status, fulfilment, payment_method,
  customer_name, customer_email, customer_phone,
  delivery_address, delivery_city, delivery_lat, delivery_lng, pickup_notes,
  subtotal_centavos, own_fee_centavos, paymongo_fee_centavos, delivery_fee_centavos,
  service_fee_centavos, total_centavos, paymongo_fee_actual_centavos,
  paymongo_checkout_url, paymongo_payment_id, paid_at, expires_at,
  status_changed_at, admin_notes, cancelled_reason, created_at,
  items:streetproculture_order_items (
    id, product_id, product_name, product_slug, image_url,
    unit_price_centavos, quantity, line_total_centavos, track_inventory_at_purchase
  )
`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    publicToken: row.public_token,
    userId: row.user_id,
    status: row.status,
    fulfilment: row.fulfilment,
    paymentMethod: row.payment_method,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    deliveryCity: row.delivery_city,
    deliveryLat: row.delivery_lat === null ? null : Number(row.delivery_lat),
    deliveryLng: row.delivery_lng === null ? null : Number(row.delivery_lng),
    pickupNotes: row.pickup_notes,
    subtotalCentavos: row.subtotal_centavos,
    ownFeeCentavos: row.own_fee_centavos,
    paymongoFeeCentavos: row.paymongo_fee_centavos,
    deliveryFeeCentavos: row.delivery_fee_centavos,
    serviceFeeCentavos: row.service_fee_centavos,
    totalCentavos: row.total_centavos,
    paymongoFeeActualCentavos: row.paymongo_fee_actual_centavos,
    paymongoCheckoutUrl: row.paymongo_checkout_url,
    paymongoPaymentId: row.paymongo_payment_id,
    paidAt: row.paid_at,
    expiresAt: row.expires_at,
    statusChangedAt: row.status_changed_at,
    adminNotes: row.admin_notes,
    cancelledReason: row.cancelled_reason,
    createdAt: row.created_at,
    items: (row.items ?? []).map((i: any) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      productSlug: i.product_slug,
      imageUrl: i.image_url,
      unitPriceCentavos: i.unit_price_centavos,
      quantity: i.quantity,
      lineTotalCentavos: i.line_total_centavos,
      trackInventoryAtPurchase: i.track_inventory_at_purchase,
    })),
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

/** Public order tracking — service-role lookup by the capability token. */
export async function getOrderByToken(token: string): Promise<Order | null> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("streetproculture_orders")
    .select(ORDER_COLUMNS)
    .eq("public_token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToOrder(data);
}

/** The signed-in user's own orders (RLS enforced). */
export async function listOrdersForUser(): Promise<Order[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("streetproculture_orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(rowToOrder);
}

/** Every order — superadmin only (RLS + caller also runs requireSuperadmin). */
export async function listOrdersForAdmin(): Promise<Order[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("streetproculture_orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(rowToOrder);
}

export async function getOrderForAdmin(id: string): Promise<Order | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("streetproculture_orders")
    .select(ORDER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToOrder(data);
}
