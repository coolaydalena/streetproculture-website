"use server";

import { revalidateTag } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SETTINGS_TAG } from "@/lib/settings";
import { PRODUCTS_TAG } from "@/lib/products-db";
import {
  settingsFormSchema,
  type SettingsFormValues,
} from "@/lib/validation/settings";

export type SettingsActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const pesos = (n: number) => Math.round(n * 100);

export async function updateSettings(
  _prev: SettingsActionState,
  values: SettingsFormValues,
): Promise<SettingsActionState> {
  const profile = await requireSuperadmin();
  const supabase = await createSupabaseServerClient();

  const parsed = settingsFormSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }
  const v = parsed.data;

  const { error: settingsError } = await supabase
    .from("streetproculture_settings")
    .update({
      own_fee_percent: v.ownFeePercent,
      own_fee_fixed_centavos: pesos(v.ownFeeFixedPesos),
      delivery_fee_centavos: pesos(v.deliveryFeePesos),
      pay_at_shop_enabled: v.payAtShopEnabled,
      checkout_enabled: v.checkoutEnabled,
      updated_by: profile.id,
    })
    .eq("id", true);

  if (settingsError) return { ok: false, error: settingsError.message };

  for (const m of v.methods) {
    const { error } = await supabase
      .from("streetproculture_payment_methods")
      .update({
        label: m.label,
        fee_percent: m.feePercent,
        fee_fixed_centavos: pesos(m.feeFixedPesos),
        fee_is_floor: m.feeIsFloor,
        min_centavos: pesos(m.minPesos),
        is_enabled: m.isEnabled,
      })
      .eq("code", m.code);
    if (error) return { ok: false, error: error.message };
  }

  revalidateTag(SETTINGS_TAG, "max");
  // Enabled-method list feeds the storefront checkout, which reads cached data.
  revalidateTag(PRODUCTS_TAG, "max");
  return { ok: true };
}
