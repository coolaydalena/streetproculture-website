"use server";

import { revalidateTag } from "next/cache";
import { getUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSettings } from "@/lib/settings";
import { PRODUCTS_TAG, storageImageUrl } from "@/lib/products-db";
import { SITE_URL } from "@/lib/site";
import {
  computeOrderPricing,
  formatCentavos,
  methodMinimumCentavos,
} from "@/lib/money";
import {
  buildOwnFeeSplit,
  createCheckoutSession,
  type PayMongoLineItem,
} from "@/lib/paymongo";
import { checkoutSchema, type CheckoutValues } from "@/lib/validation/checkout";

export type CheckoutResult =
  | { ok: true; redirectTo: string; external: boolean }
  | { ok: false; error?: string; fieldErrors?: Record<string, string> };

/* eslint-disable @typescript-eslint/no-explicit-any */
function primaryImageUrl(product: any): string | null {
  const images: any[] = product.images ?? [];
  if (images.length === 0) return null;
  const sorted = [...images].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const pick = sorted.find((i) => i.is_primary) ?? sorted[0];
  return storageImageUrl(pick.storage_path, pick.is_uploaded);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function createCheckout(
  input: CheckoutValues,
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }
  const v = parsed.data;

  const settings = await getSettings();
  if (!settings.checkoutEnabled) {
    return { ok: false, error: "Checkout isn’t open yet." };
  }

  const isPayAtShop = v.paymentMethod === "pay_at_shop";
  if (isPayAtShop && !settings.payAtShopEnabled) {
    return { ok: false, error: "Pay at the shop is currently unavailable." };
  }

  const user = await getUser();
  const admin = createSupabaseAdminClient();

  // --- Load + validate the cart against the live catalogue --------------------
  const ids = v.items.map((i) => i.productId);
  const { data: products, error: productsError } = await admin
    .from("streetproculture_products")
    .select(
      `id, slug, name, price, is_published, track_inventory, stock_quantity,
       images:streetproculture_product_images (
         storage_path, is_uploaded, is_primary, sort_order
       )`,
    )
    .in("id", ids);

  if (productsError) return { ok: false, error: productsError.message };

  const lines: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    trackInventory: boolean;
    unitPriceCentavos: number;
    quantity: number;
  }[] = [];

  for (const item of v.items) {
    const p = products?.find((x) => x.id === item.productId);
    if (!p || !p.is_published) {
      return {
        ok: false,
        fieldErrors: {
          items: "An item in your cart is no longer available. Refresh your cart.",
        },
      };
    }
    if (
      p.track_inventory &&
      (p.stock_quantity ?? 0) < item.quantity
    ) {
      return {
        ok: false,
        fieldErrors: { items: `“${p.name}” is out of stock.` },
      };
    }
    lines.push({
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: primaryImageUrl(p),
      trackInventory: p.track_inventory,
      unitPriceCentavos: p.price * 100,
      quantity: item.quantity,
    });
  }

  // --- Resolve the chosen payment method ------------------------------------
  let method: {
    feePercent: number;
    feeFixedCentavos: number;
    minCentavos: number;
  } | null = null;

  if (!isPayAtShop) {
    const { data: m } = await admin
      .from("streetproculture_payment_methods")
      .select("fee_percent, fee_fixed_centavos, min_centavos, is_enabled")
      .eq("code", v.paymentMethod)
      .maybeSingle();
    if (!m || !m.is_enabled) {
      return {
        ok: false,
        fieldErrors: { paymentMethod: "That payment method isn’t available." },
      };
    }
    method = {
      feePercent: Number(m.fee_percent),
      feeFixedCentavos: m.fee_fixed_centavos,
      minCentavos: m.min_centavos,
    };
  }

  // --- Recompute pricing (never trust the client) --------------------------
  const pricing = computeOrderPricing({
    items: lines.map((l) => ({
      unitPriceCentavos: l.unitPriceCentavos,
      quantity: l.quantity,
    })),
    fulfilment: v.fulfilment,
    method,
    settings: {
      ownFeePercent: settings.ownFeePercent,
      ownFeeFixedCentavos: settings.ownFeeFixedCentavos,
      deliveryFeeCentavos: settings.deliveryFeeCentavos,
    },
  });

  if (!isPayAtShop) {
    const min = methodMinimumCentavos(method);
    if (pricing.totalCentavos < min) {
      return {
        ok: false,
        error: `The order total must be at least ${formatCentavos(min)} to pay online.`,
      };
    }
  }

  // --- Create the order ----------------------------------------------------
  const { data: order, error: orderError } = await admin
    .from("streetproculture_orders")
    .insert({
      user_id: user?.id ?? null,
      status: isPayAtShop ? "pending_pay_at_shop" : "pending_payment",
      fulfilment: v.fulfilment,
      payment_method: v.paymentMethod,
      customer_name: v.name,
      customer_email: v.email,
      customer_phone: v.phone,
      delivery_address: v.fulfilment === "delivery" ? v.address : null,
      delivery_city: v.fulfilment === "delivery" ? v.city : null,
      delivery_lat:
        v.fulfilment === "delivery" ? v.deliveryLat ?? null : null,
      delivery_lng:
        v.fulfilment === "delivery" ? v.deliveryLng ?? null : null,
      pickup_notes:
        v.fulfilment === "pickup" && v.pickupNotes ? v.pickupNotes : null,
      subtotal_centavos: pricing.subtotalCentavos,
      own_fee_centavos: pricing.ownFeeCentavos,
      paymongo_fee_centavos: pricing.paymongoFeeCentavos,
      delivery_fee_centavos: pricing.deliveryFeeCentavos,
      service_fee_centavos: pricing.serviceFeeCentavos,
      total_centavos: pricing.totalCentavos,
      settings_snapshot: {
        own_fee_percent: settings.ownFeePercent,
        own_fee_fixed_centavos: settings.ownFeeFixedCentavos,
        delivery_fee_centavos: settings.deliveryFeeCentavos,
        method_code: v.paymentMethod,
        method_fee_percent: method?.feePercent ?? 0,
        method_fee_fixed_centavos: method?.feeFixedCentavos ?? 0,
      },
      expires_at: isPayAtShop
        ? null
        : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    })
    .select("id, order_number, public_token")
    .single();

  if (orderError || !order) {
    return { ok: false, error: orderError?.message ?? "Could not create the order." };
  }

  const { error: itemsError } = await admin
    .from("streetproculture_order_items")
    .insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.id,
        product_name: l.name,
        product_slug: l.slug,
        image_url: l.imageUrl,
        unit_price_centavos: l.unitPriceCentavos,
        quantity: l.quantity,
        line_total_centavos: l.unitPriceCentavos * l.quantity,
        track_inventory_at_purchase: l.trackInventory,
      })),
    );

  if (itemsError) {
    await admin
      .from("streetproculture_orders")
      .update({ status: "cancelled", cancelled_reason: "order-item insert failed" })
      .eq("id", order.id);
    return { ok: false, error: itemsError.message };
  }

  // --- Pay at shop: done, no PayMongo transaction -------------------------
  if (isPayAtShop) {
    return {
      ok: true,
      redirectTo: `/orders/${order.public_token}`,
      external: false,
    };
  }

  // --- Online: create a PayMongo checkout session ------------------------
  try {
    const lineItems: PayMongoLineItem[] = [
      ...lines.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        amount: l.unitPriceCentavos,
        currency: "PHP" as const,
      })),
      {
        name: "Service Fee",
        quantity: 1,
        amount: pricing.serviceFeeCentavos,
        currency: "PHP" as const,
      },
    ];
    if (pricing.deliveryFeeCentavos > 0) {
      lineItems.push({
        name: "Delivery Fee",
        quantity: 1,
        amount: pricing.deliveryFeeCentavos,
        currency: "PHP" as const,
      });
    }

    const session = await createCheckoutSession({
      referenceNumber: order.order_number,
      description: `Street Pro Culture ${order.order_number}`,
      lineItems,
      paymentMethod: v.paymentMethod,
      successUrl: `${SITE_URL}/checkout/success?token=${order.public_token}`,
      cancelUrl: `${SITE_URL}/checkout/cancelled?token=${order.public_token}`,
      billing: { name: v.name, email: v.email, phone: v.phone },
      metadata: { order_id: order.id, public_token: order.public_token },
      // Platform mode: route the "own fee" to our parent account, SPC keeps the rest.
      splitPayment: buildOwnFeeSplit(pricing.ownFeeCentavos),
    });

    await admin
      .from("streetproculture_orders")
      .update({
        paymongo_checkout_session_id: session.id,
        paymongo_checkout_url: session.checkoutUrl,
      })
      .eq("id", order.id);

    revalidateTag(PRODUCTS_TAG, "max");
    return { ok: true, redirectTo: session.checkoutUrl, external: true };
  } catch (e) {
    await admin
      .from("streetproculture_orders")
      .update({
        status: "expired",
        cancelled_reason:
          e instanceof Error ? e.message : "PayMongo session failed",
      })
      .eq("id", order.id);
    return {
      ok: false,
      error: "We couldn’t start the payment. Please try again in a moment.",
    };
  }
}
