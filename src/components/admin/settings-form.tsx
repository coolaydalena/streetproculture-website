"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  settingsFormSchema,
  type SettingsFormValues,
} from "@/lib/validation/settings";
import { updateSettings } from "@/lib/actions/settings";
import type { PaymentMethod, StoreSettings } from "@/lib/payments";
import { Field, Input, Checkbox } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

function toDefaults(
  settings: StoreSettings,
  methods: PaymentMethod[],
): SettingsFormValues {
  return {
    ownFeePercent: settings.ownFeePercent,
    ownFeeFixedPesos: settings.ownFeeFixedCentavos / 100,
    deliveryFeePesos: settings.deliveryFeeCentavos / 100,
    payAtShopEnabled: settings.payAtShopEnabled,
    checkoutEnabled: settings.checkoutEnabled,
    methods: methods.map((m) => ({
      code: m.code,
      label: m.label,
      feePercent: m.feePercent,
      feeFixedPesos: m.feeFixedCentavos / 100,
      feeIsFloor: m.feeIsFloor,
      minPesos: m.minCentavos / 100,
      isEnabled: m.isEnabled,
    })),
  };
}

export function SettingsForm({
  settings,
  methods,
}: {
  settings: StoreSettings;
  methods: PaymentMethod[];
}) {
  const { push } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: toDefaults(settings, methods),
  });
  const { register, control, handleSubmit, setError, formState } = form;
  const errors = formState.errors;
  const methodFields = useFieldArray({ control, name: "methods" });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res = await updateSettings({ ok: false }, values);
      if (res.ok) {
        push("Settings saved", "success");
        router.refresh();
        return;
      }
      if (res.fieldErrors) {
        for (const [key, message] of Object.entries(res.fieldErrors)) {
          setError(key as keyof SettingsFormValues, { message });
        }
      }
      if (res.error) push(res.error, "error");
    });
  });

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-10">
      <section className="space-y-5">
        <h2 className="u-label text-oxblood">Store fees</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Own fee — percent of subtotal (%)"
            htmlFor="ownFeePercent"
            error={errors.ownFeePercent?.message}
            hint="Charged whichever is higher: this % or the fixed floor below."
          >
            <Input
              id="ownFeePercent"
              type="number"
              min={0}
              max={100}
              step={0.01}
              {...register("ownFeePercent", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="Own fee — fixed floor (₱)"
            htmlFor="ownFeeFixedPesos"
            error={errors.ownFeeFixedPesos?.message}
            hint="Minimum ₱100 per order."
          >
            <Input
              id="ownFeeFixedPesos"
              type="number"
              min={100}
              step={1}
              {...register("ownFeeFixedPesos", { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field
          label="Delivery fee (₱)"
          htmlFor="deliveryFeePesos"
          error={errors.deliveryFeePesos?.message}
          hint="Flat amount added to delivery orders."
        >
          <Input
            id="deliveryFeePesos"
            type="number"
            min={0}
            step={1}
            {...register("deliveryFeePesos", { valueAsNumber: true })}
          />
        </Field>

        <div className="space-y-3 border-t border-line pt-5">
          <Checkbox
            label="Enable online checkout"
            description="Turn on the /checkout flow for customers."
            {...register("checkoutEnabled")}
          />
          <Checkbox
            label="Allow “pay at the shop” for pickup"
            description="Pickup orders can skip online payment."
            {...register("payAtShopEnabled")}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="u-label text-oxblood">PayMongo methods</h2>
        <p className="text-xs text-ink-soft">
          The processing fee for the method the customer chooses is added to the
          Service Fee (grossed up so PayMongo&apos;s deduction is covered). Keep
          these in step with PayMongo&apos;s published rates. Check &quot;Floor?&quot;
          for methods PayMongo prices as &quot;X% or ₱Y, whichever is higher&quot;
          (e.g. Direct Online Banking) instead of &quot;X% + ₱Y&quot; (e.g. Cards).
        </p>

        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="u-label p-3 text-ink-soft">Method</th>
                <th className="u-label p-3 text-ink-soft">Label</th>
                <th className="u-label p-3 text-ink-soft">Fee %</th>
                <th className="u-label p-3 text-ink-soft">Fee ₱</th>
                <th className="u-label p-3 text-ink-soft">Floor?</th>
                <th className="u-label p-3 text-ink-soft">Min ₱</th>
                <th className="u-label p-3 text-ink-soft">On</th>
              </tr>
            </thead>
            <tbody>
              {methodFields.fields.map((row, i) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="p-3 font-mono text-xs">{row.code}</td>
                  <td className="p-3">
                    <input type="hidden" {...register(`methods.${i}.code`)} />
                    <input
                      className="w-full border border-line bg-paper-card px-2 py-1.5 text-sm outline-none focus:border-oxblood"
                      {...register(`methods.${i}.label`)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step={0.001}
                      min={0}
                      className="w-20 border border-line bg-paper-card px-2 py-1.5 text-sm outline-none focus:border-oxblood"
                      {...register(`methods.${i}.feePercent`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step={0.01}
                      min={0}
                      className="w-20 border border-line bg-paper-card px-2 py-1.5 text-sm outline-none focus:border-oxblood"
                      {...register(`methods.${i}.feeFixedPesos`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      title="Fee = max(%, ₱) instead of % + ₱"
                      className="size-4 accent-oxblood"
                      {...register(`methods.${i}.feeIsFloor`)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step={1}
                      min={0}
                      className="w-24 border border-line bg-paper-card px-2 py-1.5 text-sm outline-none focus:border-oxblood"
                      {...register(`methods.${i}.minPesos`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="size-4 accent-oxblood"
                      {...register(`methods.${i}.isEnabled`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.methods?.message && (
          <p className="text-xs text-oxblood">{errors.methods.message}</p>
        )}
      </section>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
