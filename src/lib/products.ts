// Product domain types + pure helpers. All data now lives in Supabase — see
// `products-db.ts` (public reads) and `products-admin.ts` (CMS reads). This file
// stays dependency-free so client components can import the types and helpers.

export type ProductCategory = "caps" | "helmets" | "cases" | "merch";

export type Spec = { label: string; value: string };

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  tag: string;
  name: string;
  price: number; // whole PHP
  blurb: string;
  brand: string | null;
  specs: Spec[];
  images: ProductImage[];
  /** Primary image URL (falls back to the placeholder when there are none). */
  image: string;
  trackInventory: boolean;
  stockQuantity: number | null;
  /** Derived: `!trackInventory || (stockQuantity ?? 0) > 0`. */
  inStock: boolean;
  isHighlighted: boolean;
  isPublished: boolean;
  isMock: boolean;
};

export const PLACEHOLDER_IMAGE = "/images/products/placeholder.svg";

export const CATEGORIES: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "All Gear" },
  { id: "caps", label: "Caps" },
  { id: "helmets", label: "Helmets" },
  { id: "cases", label: "Cases" },
  { id: "merch", label: "Merch" },
];

/** The four real categories, for the CMS form `<select>`. */
export const PRODUCT_CATEGORIES = CATEGORIES.filter(
  (c): c is { id: ProductCategory; label: string } => c.id !== "all",
);

export function categoryLabel(category: ProductCategory | "all"): string {
  return CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.some((c) => c.id === value);
}

export function productInStock(p: {
  trackInventory: boolean;
  stockQuantity: number | null;
}): boolean {
  return !p.trackInventory || (p.stockQuantity ?? 0) > 0;
}

/** Other gear in the same category, for the detail page's related rail. */
export function getRelated(
  product: Pick<Product, "id" | "category">,
  pool: Product[],
  limit = 3,
): Product[] {
  return pool
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
