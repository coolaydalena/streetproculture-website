import "server-only";

import { unstable_cache } from "next/cache";
import { supabaseAnon } from "@/lib/supabase/anon";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEFAULT_SETTINGS,
  PAYMENT_METHOD_COLUMNS,
  SETTINGS_COLUMNS,
  SETTINGS_TAG,
  rowToPaymentMethod,
  rowToSettings,
  type PaymentMethod,
  type StoreSettings,
} from "@/lib/payments";

export {
  SETTINGS_TAG,
  DEFAULT_SETTINGS,
  PAYMENT_METHOD_CODES,
} from "@/lib/payments";
export type {
  StoreSettings,
  PaymentMethod,
  PaymentMethodCode,
} from "@/lib/payments";

/** Store-wide fee config. Falls back to DEFAULT_SETTINGS if unconfigured. */
export const getSettings = unstable_cache(
  async (): Promise<StoreSettings> => {
    if (!SUPABASE_CONFIGURED) return DEFAULT_SETTINGS;
    const { data, error } = await supabaseAnon
      .from("streetproculture_settings")
      .select(SETTINGS_COLUMNS)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToSettings(data) : DEFAULT_SETTINGS;
  },
  ["store-settings"],
  { tags: [SETTINGS_TAG] },
);

/** Enabled PayMongo methods, for the checkout picker. */
export const getEnabledPaymentMethods = unstable_cache(
  async (): Promise<PaymentMethod[]> => {
    if (!SUPABASE_CONFIGURED) return [];
    const { data, error } = await supabaseAnon
      .from("streetproculture_payment_methods")
      .select(PAYMENT_METHOD_COLUMNS)
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToPaymentMethod);
  },
  ["payment-methods-enabled"],
  { tags: [SETTINGS_TAG] },
);

/** Admin (uncached, all methods incl. disabled). RLS requires superadmin. */
export async function getSettingsForAdmin(): Promise<{
  settings: StoreSettings;
  methods: PaymentMethod[];
}> {
  const supabase = await createSupabaseServerClient();
  const [settingsRes, methodsRes] = await Promise.all([
    supabase.from("streetproculture_settings").select(SETTINGS_COLUMNS).maybeSingle(),
    supabase
      .from("streetproculture_payment_methods")
      .select(PAYMENT_METHOD_COLUMNS)
      .order("sort_order", { ascending: true }),
  ]);

  if (settingsRes.error) throw settingsRes.error;
  if (methodsRes.error) throw methodsRes.error;

  return {
    settings: settingsRes.data
      ? rowToSettings(settingsRes.data)
      : DEFAULT_SETTINGS,
    methods: (methodsRes.data ?? []).map(rowToPaymentMethod),
  };
}
