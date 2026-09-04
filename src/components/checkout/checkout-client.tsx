"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/store/cart-store";
import { createCheckout } from "@/lib/actions/checkout";
import { checkoutSchema } from "@/lib/validation/checkout";
import { computeOrderPricing } from "@/lib/money";
import { formatPrice } from "@/lib/site";
import type { PaymentMethod, StoreSettings } from "@/lib/payments";
import { useToast } from "@/components/ui/toast";
import { OrderBreakdown } from "@/components/checkout/order-breakdown";
import { RefundNotice } from "@/components/checkout/refund-notice";
import {
  LocationPicker,
  type LatLng,
} from "@/components/checkout/location-picker";

const METHOD_LOGOS: Record<PaymentMethod["code"], string[]> = {
  card: [
    "/images/payment-methods/card-visa.svg",
    "/images/payment-methods/card-mastercard.svg",
  ],
  gcash: ["/images/payment-methods/gcash.svg"],
  paymaya: ["/images/payment-methods/maya.svg"],
  grab_pay: ["/images/payment-methods/grabpay.svg"],
  qrph: ["/images/payment-methods/qrph.svg"],
  brankas_bdo: ["/images/payment-methods/bdo.png"],
  dob: ["/images/payment-methods/bpi.png"],
  brankas_landbank: ["/images/payment-methods/landbank.png"],
  brankas_metrobank: ["/images/payment-methods/metrobank.png"],
  dob_ubp: ["/images/payment-methods/unionbank.png"],
};

type Fulfilment = "pickup" | "delivery";

export function CheckoutClient({
  settings,
  methods,
}: {
  settings: StoreSettings;
  methods: PaymentMethod[];
}) {
  const router = useRouter();
  const { push } = useToast();
  const { detailed, count, hasUnavailable, hydrated, lines, clear } = useCart();
  const [pending, startTransition] = useTransition();
  // Set once an order is placed so clearing the cart doesn't trip the
  // empty-cart redirect below before we navigate to the order.
  const leavingForOrder = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    fulfilment: "pickup" as Fulfilment,
    paymentMethod: "" as PaymentMethod["code"] | "pay_at_shop" | "",
    address: "",
    city: "",
    pickupNotes: "",
  });
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorCount = Object.keys(errors).length;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const payAtShopAvailable =
    settings.payAtShopEnabled && form.fulfilment === "pickup";

  function setFulfilment(f: Fulfilment) {
    setForm((prev) => ({
      ...prev,
      fulfilment: f,
      // Drop an incompatible "pay at shop" choice when switching to delivery.
      paymentMethod:
        f === "delivery" && prev.paymentMethod === "pay_at_shop"
          ? ""
          : prev.paymentMethod,
    }));
  }

  // Redirect away from an empty cart once it has hydrated.
  useEffect(() => {
    if (leavingForOrder.current) return;
    if (hydrated && count === 0) router.replace("/shop");
  }, [hydrated, count, router]);

  const selectedOnlineMethod =
    form.paymentMethod && form.paymentMethod !== "pay_at_shop"
      ? methods.find((m) => m.code === form.paymentMethod) ?? null
      : null;

  const pricing = useMemo(
    () =>
      computeOrderPricing({
        items: detailed
          .filter((l) => !l.unavailable)
          .map((l) => ({
            unitPriceCentavos: Math.round(l.product.price * 100),
            quantity: l.qty,
          })),
        fulfilment: form.fulfilment,
        method:
          form.paymentMethod === "pay_at_shop"
            ? null
            : selectedOnlineMethod
              ? {
                  feePercent: selectedOnlineMethod.feePercent,
                  feeFixedCentavos: selectedOnlineMethod.feeFixedCentavos,
                  feeIsFloor: selectedOnlineMethod.feeIsFloor,
                  minCentavos: selectedOnlineMethod.minCentavos,
                }
              : null,
        settings: {
          ownFeePercent: settings.ownFeePercent,
          ownFeeFixedCentavos: settings.ownFeeFixedCentavos,
          deliveryFeeCentavos: settings.deliveryFeeCentavos,
        },
      }),
    [detailed, form.fulfilment, form.paymentMethod, selectedOnlineMethod, settings],
  );

  function focusFirstError(keys: string[]) {
    requestAnimationFrame(() => {
      const el =
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
        (keys.includes("paymentMethod")
          ? formRef.current?.querySelector<HTMLElement>("#payment-section")
          : null) ??
        formRef.current?.querySelector<HTMLElement>('[data-error="true"]');
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus?.();
    });
  }

  function fail(next: Record<string, string>) {
    setErrors(next);
    focusFirstError(Object.keys(next));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hasUnavailable) {
      fail({ items: "Remove unavailable items before checking out." });
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      fulfilment: form.fulfilment,
      paymentMethod: form.paymentMethod || undefined,
      address: form.address,
      city: form.city,
      pickupNotes: form.pickupNotes,
      deliveryLat: form.fulfilment === "delivery" ? coords?.lat ?? null : null,
      deliveryLng: form.fulfilment === "delivery" ? coords?.lng ?? null : null,
      items: lines.map((l) => ({ productId: l.id, quantity: l.qty })),
    };

    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!fe[key]) fe[key] = issue.message;
      }
      if (fe.paymentMethod) fe.paymentMethod = "Choose how you'd like to pay.";
      fail(fe);
      return;
    }

    setErrors({});
    startTransition(async () => {
      const res = await createCheckout(parsed.data);
      if (res.ok) {
        leavingForOrder.current = true;
        if (res.external) {
          window.location.href = res.redirectTo;
        } else {
          router.push(res.redirectTo);
        }
        clear();
        return;
      }
      if (res.fieldErrors) fail(res.fieldErrors);
      if (res.error) push(res.error, "error");
    });
  }

  if (!hydrated) {
    return (
      <p className="u-label text-ink-soft">Loading your cart…</p>
    );
  }
  if (count === 0) return null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="grid gap-12 lg:grid-cols-[1fr_22rem]"
    >
      {/* ---- Details ---- */}
      <div className="space-y-8">
        {errorCount > 0 && (
          <p
            role="alert"
            className="border border-oxblood bg-oxblood/5 px-4 py-3 text-sm text-oxblood"
          >
            Please fix the {errorCount === 1 ? "field" : `${errorCount} fields`}{" "}
            highlighted below.
          </p>
        )}

        <section className="space-y-4">
          <h2 className="u-label text-oxblood">Contact</h2>
          <TextField
            label="Full Name"
            value={form.name}
            onChange={(v) => set("name", v)}
            error={errors.name}
            autoComplete="name"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => set("email", v)}
            error={errors.email}
            autoComplete="email"
            required
          />
          <TextField
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(v) => set("phone", v)}
            error={errors.phone}
            autoComplete="tel"
            required
          />
        </section>

        <section className="space-y-4">
          <h2 className="u-label text-oxblood">Fulfilment</h2>
          <div className="grid grid-cols-2 gap-2">
            {(["pickup", "delivery"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFulfilment(f)}
                className={`u-label border py-3 capitalize transition-colors ${
                  form.fulfilment === f
                    ? "border-oxblood bg-oxblood text-paper"
                    : "border-line hover:border-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {form.fulfilment === "delivery" ? (
            <>
              <TextField
                label="Delivery Address"
                value={form.address}
                onChange={(v) => set("address", v)}
                error={errors.address}
                autoComplete="street-address"
                required
              />
              <TextField
                label="City / Municipality"
                value={form.city}
                onChange={(v) => set("city", v)}
                error={errors.city}
                autoComplete="address-level2"
                required
              />
              <LocationPicker value={coords} onChange={setCoords} />
            </>
          ) : (
            <TextField
              label="Notes for Pickup (optional)"
              value={form.pickupNotes}
              onChange={(v) => set("pickupNotes", v)}
              error={errors.pickupNotes}
            />
          )}
        </section>

        <section
          id="payment-section"
          tabIndex={-1}
          className="space-y-3 scroll-mt-24 outline-none"
        >
          <h2 className="u-label text-oxblood">Payment</h2>
          {errors.paymentMethod && (
            <p className="text-xs text-oxblood">{errors.paymentMethod}</p>
          )}
          <div className="space-y-2">
            {methods.map((m) => (
              <MethodTile
                key={m.code}
                label={m.label}
                logos={METHOD_LOGOS[m.code] ?? []}
                selected={form.paymentMethod === m.code}
                onSelect={() => set("paymentMethod", m.code)}
              />
            ))}
            {payAtShopAvailable && (
              <MethodTile
                label="Pay at the shop"
                hint="Cash or card on pickup — no online payment"
                logos={[]}
                selected={form.paymentMethod === "pay_at_shop"}
                onSelect={() => set("paymentMethod", "pay_at_shop")}
              />
            )}
          </div>
        </section>
      </div>

      {/* ---- Summary ---- */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line bg-paper-card p-5">
          <div className="flex items-center justify-between">
            <p className="u-label text-oxblood">Order Summary</p>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-soft">
              <Lock className="size-3" strokeWidth={2.5} /> Secure
            </span>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {detailed.map(({ product, qty, lineTotal, unavailable }) => (
              <li
                key={product.id}
                className="flex items-center gap-3 py-3 text-sm"
              >
                <div className="relative size-12 shrink-0 overflow-hidden bg-coal">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <span className="flex-1">
                  {product.name}{" "}
                  <span className="text-ink-soft">× {qty}</span>
                </span>
                <span className="font-mono">
                  {unavailable ? "—" : formatPrice(lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          {hasUnavailable && (
            <p className="u-label mt-3 text-oxblood">
              Some items are no longer available.{" "}
              <Link href="/shop" className="underline">
                Update cart
              </Link>
            </p>
          )}
          {errors.items && (
            <p className="mt-3 text-xs text-oxblood">{errors.items}</p>
          )}

          <div className="mt-5 border-t border-line pt-4">
            <OrderBreakdown
              subtotalCentavos={pricing.subtotalCentavos}
              serviceFeeCentavos={pricing.serviceFeeCentavos}
              deliveryFeeCentavos={pricing.deliveryFeeCentavos}
              totalCentavos={pricing.totalCentavos}
              ownFeeCentavos={pricing.ownFeeCentavos}
              paymongoFeeCentavos={pricing.paymongoFeeCentavos}
            />
          </div>

          <RefundNotice className="mt-4 border-t border-line pt-4" />

          <button
            type="submit"
            disabled={pending || count === 0 || hasUnavailable}
            className="u-label mt-5 flex w-full items-center justify-center gap-2 bg-oxblood py-4 text-paper transition-colors hover:bg-oxblood-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? (
              "Working…"
            ) : (
              <>
                <Lock className="size-3.5" strokeWidth={2.5} />
                {form.paymentMethod === "pay_at_shop"
                  ? "Place Order"
                  : "Continue to Payment"}
              </>
            )}
          </button>

          <div className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-ink-soft">
            <ShieldCheck
              className="mt-px size-4 shrink-0"
              strokeWidth={2}
            />
            {form.paymentMethod === "pay_at_shop" ? (
              <p>
                Pay in cash or by card when you collect at the shop. No card
                details are taken online.
              </p>
            ) : (
              <p>
                Card &amp; e-wallet payments run on{" "}
                <span className="text-ink">PayMongo</span>&apos;s secure
                checkout — a BSP-registered, PCI-DSS-compliant payment provider.
                Your card details never touch our servers.
              </p>
            )}
          </div>

          <Link
            href="/shop"
            className="u-label mt-4 block text-center text-ink-soft hover:text-ink"
          >
            ← Keep shopping
          </Link>
        </div>
      </aside>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block scroll-mt-24">
      <span className="u-label text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        className={`mt-2 w-full border bg-paper-card px-3 py-2.5 text-sm outline-none focus:border-oxblood ${
          error ? "border-oxblood" : "border-line"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-oxblood">{error}</span>}
    </label>
  );
}

function MethodTile({
  label,
  hint,
  logos,
  selected,
  onSelect,
}: {
  label: string;
  hint?: string;
  logos: string[];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 border px-4 py-3 text-left transition-colors ${
        selected ? "border-oxblood bg-oxblood/5" : "border-line hover:border-ink"
      }`}
    >
      <span
        className={`grid size-4 shrink-0 place-items-center rounded-full border ${
          selected ? "border-oxblood" : "border-line"
        }`}
      >
        {selected && <span className="size-2 rounded-full bg-oxblood" />}
      </span>
      <span className="flex-1">
        <span className="u-label block !tracking-[0.12em]">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-xs text-ink-soft">{hint}</span>
        )}
      </span>
      <span className="flex items-center gap-1.5">
        {logos.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className="h-5 w-auto" />
        ))}
      </span>
    </button>
  );
}
