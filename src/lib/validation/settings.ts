import { z } from "zod";
import { PAYMENT_METHOD_CODES } from "@/lib/payments";

/**
 * The /admin/settings form works in whole/decimal PESOS for readability; the
 * action converts to centavos before writing. The ₱100 minimum on the own-fee
 * floor is enforced here and by a CHECK constraint.
 */
export const settingsFormSchema = z.object({
  ownFeePercent: z
    .number({ error: "Enter a percentage" })
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%"),
  ownFeeFixedPesos: z
    .number({ error: "Enter an amount" })
    .min(100, "Minimum ₱100 per order")
    .max(100000),
  deliveryFeePesos: z
    .number({ error: "Enter an amount" })
    .min(0, "Cannot be negative")
    .max(100000),
  payAtShopEnabled: z.boolean(),
  checkoutEnabled: z.boolean(),
  methods: z
    .array(
      z.object({
        code: z.enum(PAYMENT_METHOD_CODES),
        label: z.string().trim().min(1, "Label required").max(60),
        feePercent: z
          .number({ error: "Enter a rate" })
          .min(0, "Cannot be negative")
          .max(99.999, "Too high"),
        feeFixedPesos: z
          .number({ error: "Enter an amount" })
          .min(0, "Cannot be negative")
          .max(100000),
        minPesos: z
          .number({ error: "Enter an amount" })
          .min(0, "Cannot be negative")
          .max(100000),
        isEnabled: z.boolean(),
      }),
    )
    .max(10),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
