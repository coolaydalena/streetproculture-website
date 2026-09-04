import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * PayMongo Checkout Sessions — hosted payment page. The customer picks the
 * method on OUR checkout, so every session is locked to a single
 * `payment_method_types` entry and we know the exact processing fee up front.
 *
 * Docs: https://docs.paymongo.com/reference/checkout-session-resource
 */

const API_BASE =
  process.env.PAYMONGO_API_BASE ?? "https://api.paymongo.com/v1";
const SECRET_KEY = process.env.PAYMONGO_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET ?? "";

/** Stamped on every payment's metadata and checked on every webhook. */
export const PAYMONGO_MERCHANT_ID = "streetproculture";

export const PAYMONGO_CONFIGURED = !!SECRET_KEY;
export const PAYMONGO_LIVE = SECRET_KEY.startsWith("sk_live");

function authHeader(): string {
  return "Basic " + Buffer.from(`${SECRET_KEY}:`).toString("base64");
}

function requestHeaders(): Record<string, string> {
  return {
    Authorization: authHeader(),
    "Content-Type": "application/json",
  };
}

export type PayMongoLineItem = {
  name: string;
  quantity: number;
  amount: number; // centavos
  currency: "PHP";
  description?: string;
};

export type CreateCheckoutSessionInput = {
  referenceNumber: string;
  description: string;
  lineItems: PayMongoLineItem[];
  paymentMethod: string; // single method, e.g. "card" | "gcash"
  successUrl: string;
  cancelUrl: string;
  billing?: { name?: string; email?: string; phone?: string };
  metadata: Record<string, string>;
};

export type CreateCheckoutSessionResult = {
  id: string;
  checkoutUrl: string;
};

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult> {
  if (!PAYMONGO_CONFIGURED) {
    throw new Error("PAYMONGO_SECRET_KEY is not configured");
  }

  const body = {
    data: {
      attributes: {
        line_items: input.lineItems,
        payment_method_types: [input.paymentMethod],
        reference_number: input.referenceNumber,
        description: input.description,
        send_email_receipt: true,
        show_line_items: true,
        show_description: true,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        billing: input.billing,
        metadata: input.metadata,
      },
    },
  };

  const res = await fetch(`${API_BASE}/checkout_sessions`, {
    method: "POST",
    headers: requestHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = (await res.json()) as {
    data?: { id?: string; attributes?: { checkout_url?: string } };
    errors?: { detail?: string }[];
  };

  if (!res.ok || !json.data?.attributes?.checkout_url) {
    const detail =
      json.errors?.map((e) => e.detail).filter(Boolean).join("; ") ||
      `PayMongo returned ${res.status}`;
    throw new Error(`PayMongo checkout session failed: ${detail}`);
  }

  return {
    id: json.data.id as string,
    checkoutUrl: json.data.attributes.checkout_url,
  };
}

export async function retrieveCheckoutSession(id: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/checkout_sessions/${id}`, {
    headers: requestHeaders(),
    cache: "no-store",
  });
  return res.json();
}

// ---------------------------------------------------------------------------
// Webhook signature verification
//
// The `Paymongo-Signature` header looks like:
//   t=1699999999,te=<hex hmac>,li=<hex hmac>
// The signed payload is `${t}.${rawBody}`, HMAC-SHA256 with the webhook secret.
// `te` is populated in test mode, `li` in live mode.
// ---------------------------------------------------------------------------

const SIGNATURE_TOLERANCE_SECONDS = 300;

export function verifyWebhookSignature(
  rawBody: string,
  header: string | null,
): boolean {
  if (!WEBHOOK_SECRET || !header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const idx = kv.indexOf("=");
      return [kv.slice(0, idx).trim(), kv.slice(idx + 1).trim()];
    }),
  ) as { t?: string; te?: string; li?: string };

  const timestamp = Number(parts.t);
  const provided = PAYMONGO_LIVE ? parts.li : parts.te;
  if (!timestamp || !provided) return false;

  if (Math.abs(Date.now() / 1000 - timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }

  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// Webhook payload shapes (defensive — PayMongo nests the resource under
// data.attributes.data and the event type under data.attributes.type).
// ---------------------------------------------------------------------------

export type PayMongoWebhookEvent = {
  data: {
    id: string;
    attributes: {
      type: string;
      data?: {
        id?: string;
        type?: string;
        attributes?: {
          reference_number?: string;
          metadata?: Record<string, string> | null;
          fee?: number;
          net_amount?: number;
          amount?: number;
          payments?: {
            id: string;
            attributes?: { fee?: number; net_amount?: number; amount?: number };
          }[];
          payment_intent?: { id?: string };
        };
      };
    };
  };
};

/** Pull the useful bits out of a checkout_session.* / payment.* event. */
export function readPaidEvent(evt: PayMongoWebhookEvent): {
  orderId?: string;
  publicToken?: string;
  referenceNumber?: string;
  checkoutSessionId?: string;
  paymentId?: string;
  feeCentavos?: number;
} {
  const resource = evt.data.attributes.data;
  const attrs = resource?.attributes ?? {};
  const payment = attrs.payments?.[0];

  return {
    orderId: attrs.metadata?.order_id,
    publicToken: attrs.metadata?.public_token,
    referenceNumber: attrs.reference_number,
    checkoutSessionId: resource?.type === "checkout_session" ? resource.id : undefined,
    paymentId: payment?.id ?? (resource?.type === "payment" ? resource.id : undefined),
    feeCentavos: payment?.attributes?.fee ?? attrs.fee,
  };
}
