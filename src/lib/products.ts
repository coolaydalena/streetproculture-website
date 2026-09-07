// Product domain types + pure helpers. All data now lives in Supabase — see
// `products-db.ts` (public reads) and `products-admin.ts` (CMS reads). This file
// stays dependency-free so client components can import the types and helpers.

export type ProductCategory = "caps" | "helmets" | "cases" | "merch" | "parts";

export type Spec = { label: string; value: string };

export type ProductMediaType = "image" | "video";

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
  mediaType: ProductMediaType;
};

export type ProductVariant = {
  id: string;
  label: string;
  sku: string | null;
  price: number; // whole PHP
  /** "Was" price. When above `price` the storefront shows a strikethrough + % off. */
  compareAtPrice: number | null;
  trackInventory: boolean;
  stockQuantity: number | null;
  /** Derived: `!trackInventory || (stockQuantity ?? 0) > 0`. */
  inStock: boolean;
  /** The media row that represents this variant (swaps the gallery on selection). */
  imageId: string | null;
  isActive: boolean;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  tag: string;
  name: string;
  /** One-line summary — cards + the <meta> description. */
  blurb: string;
  /** Long-form copy (paragraphs split by blank lines) — rendered on the PDP. */
  description: string;
  brand: string | null;
  specs: Spec[];
  images: ProductImage[];
  /** Primary image URL (falls back to the placeholder when there are none). */
  image: string;
  variants: ProductVariant[];
  /** First active variant (by position) — the one selected by default. */
  defaultVariant: ProductVariant | null;
  /** Lowest / highest active variant price. Equal when there's a single price. */
  priceFrom: number;
  priceTo: number;
  /** Derived: any active variant in stock. */
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
  { id: "parts", label: "Parts" },
];

/** The real categories, for the CMS form `<select>`. */
export const PRODUCT_CATEGORIES = CATEGORIES.filter(
  (c): c is { id: ProductCategory; label: string } => c.id !== "all",
);

export function categoryLabel(category: ProductCategory | "all"): string {
  return CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.some((c) => c.id === value);
}

export function variantInStock(v: {
  trackInventory: boolean;
  stockQuantity: number | null;
}): boolean {
  return !v.trackInventory || (v.stockQuantity ?? 0) > 0;
}

/** A variant is on sale when its compare-at price sits above the sell price. */
export function variantOnSale(v: {
  price: number;
  compareAtPrice: number | null;
}): boolean {
  return v.compareAtPrice != null && v.compareAtPrice > v.price;
}

/** Rounded % off, or 0 when the variant isn't on sale. */
export function discountPercent(v: {
  price: number;
  compareAtPrice: number | null;
}): number {
  if (!variantOnSale(v) || !v.compareAtPrice) return 0;
  return Math.round(((v.compareAtPrice - v.price) / v.compareAtPrice) * 100);
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
