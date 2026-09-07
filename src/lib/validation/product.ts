import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const specSchema = z.object({
  label: z.string().trim().min(1, "Label required"),
  value: z.string().trim().min(1, "Value required"),
});

// A single clean type (no transforms / defaults) so react-hook-form's resolver
// input and output types line up. Normalisation happens in `toProductRow`.
export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(SLUG_RE, "Lowercase letters, numbers and single hyphens only"),
  category: z.enum(["caps", "helmets", "cases", "merch", "parts"]),
  tag: z.string().trim().max(60),
  brand: z.string().trim().max(80),
  blurb: z.string().trim().max(600),
  description: z.string().trim().max(6000),
  specs: z.array(specSchema).max(24),
  isHighlighted: z.boolean(),
  isPublished: z.boolean(),
  isMock: z.boolean(),
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
    blurb: v.blurb,
    description: v.description,
    specs: v.specs,
    is_highlighted: v.isHighlighted,
    is_published: v.isPublished,
    is_mock: v.isMock,
  };
}

// -------------------------------------------------------------------------
// Variants — price / stock / SKU live here, one row per buyable unit.
// -------------------------------------------------------------------------
export const variantFormSchema = z
  .object({
    label: z.string().trim().min(1, "Label is required").max(120),
    sku: z.string().trim().max(60),
    price: z
      .number({ error: "Price must be a number" })
      .int("Whole pesos only")
      .min(0, "Price cannot be negative"),
    compareAtPrice: z
      .number({ error: "Enter a number" })
      .int("Whole pesos only")
      .min(0, "Price cannot be negative")
      .nullable(),
    trackInventory: z.boolean(),
    stockQuantity: z
      .number({ error: "Enter a number" })
      .int("Whole units only")
      .min(0, "Stock cannot be negative")
      .nullable(),
    isActive: z.boolean(),
  })
  .refine((v) => !v.trackInventory || v.stockQuantity !== null, {
    path: ["stockQuantity"],
    error: "Set a stock quantity when tracking inventory",
  })
  .refine((v) => v.compareAtPrice === null || v.compareAtPrice >= v.price, {
    path: ["compareAtPrice"],
    error: "Compare-at price must sit at or above the sell price",
  });

export type VariantFormValues = z.infer<typeof variantFormSchema>;

/** Map validated variant form values to `streetproculture_product_variants` columns. */
export function toVariantRow(v: VariantFormValues) {
  return {
    label: v.label,
    sku: v.sku.trim() ? v.sku.trim() : null,
    price: v.price,
    compare_at_price: v.compareAtPrice,
    track_inventory: v.trackInventory,
    stock_quantity: v.trackInventory ? v.stockQuantity : null,
    is_active: v.isActive,
  };
}
