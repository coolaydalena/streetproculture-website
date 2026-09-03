import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const specSchema = z.object({
  label: z.string().trim().min(1, "Label required"),
  value: z.string().trim().min(1, "Value required"),
});

// A single clean type (no transforms / defaults) so react-hook-form's resolver
// input and output types line up. Normalisation happens in `toProductRow`.
export const productFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(120)
      .regex(SLUG_RE, "Lowercase letters, numbers and single hyphens only"),
    category: z.enum(["caps", "helmets", "cases", "merch"]),
    tag: z.string().trim().max(60),
    brand: z.string().trim().max(80),
    price: z
      .number({ error: "Price must be a number" })
      .int("Whole pesos only")
      .min(0, "Price cannot be negative"),
    blurb: z.string().trim().max(600),
    specs: z.array(specSchema).max(24),
    trackInventory: z.boolean(),
    stockQuantity: z
      .number({ error: "Enter a number" })
      .int("Whole units only")
      .min(0, "Stock cannot be negative")
      .nullable(),
    isHighlighted: z.boolean(),
    isPublished: z.boolean(),
    isMock: z.boolean(),
  })
  .refine((v) => !v.trackInventory || v.stockQuantity !== null, {
    path: ["stockQuantity"],
    error: "Set a stock quantity when tracking inventory",
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

/** Map validated form values to `streetproculture_products` column names. */
export function toProductRow(v: ProductFormValues) {
  return {
    name: v.name,
    slug: v.slug,
    category: v.category,
    tag: v.tag,
    brand: v.brand.trim() ? v.brand.trim() : null,
    price: v.price,
    blurb: v.blurb,
    specs: v.specs,
    track_inventory: v.trackInventory,
    stock_quantity: v.trackInventory ? v.stockQuantity : null,
    is_highlighted: v.isHighlighted,
    is_published: v.isPublished,
    is_mock: v.isMock,
  };
}
