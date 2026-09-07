import "server-only";

import { unstable_cache } from "next/cache";
import { supabaseAnon } from "@/lib/supabase/anon";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/env";
import {
  PLACEHOLDER_IMAGE,
  variantInStock,
  type Product,
  type ProductImage,
  type ProductMediaType,
  type ProductVariant,
  type ProductCategory,
} from "@/lib/products";

/** Cache tag revalidated by every CMS mutation (`revalidateTag(PRODUCTS_TAG, "max")`). */
export const PRODUCTS_TAG = "products";

const PRODUCT_COLUMNS = `
  id, slug, category, tag, name, blurb, description, brand, specs,
  is_highlighted, is_published, is_mock,
  images:streetproculture_product_images (
    id, storage_path, is_uploaded, alt, sort_order, is_primary, media_type
  ),
  variants:streetproculture_product_variants (
    id, label, sku, price, compare_at_price, track_inventory, stock_quantity,
    image_id, is_active, position
  )
`;

type ImageRow = {
  id: string;
  storage_path: string;
  is_uploaded: boolean;
  alt: string;
  sort_order: number;
  is_primary: boolean;
  media_type: ProductMediaType | null;
};

type VariantRow = {
  id: string;
  label: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  track_inventory: boolean;
  stock_quantity: number | null;
  image_id: string | null;
  is_active: boolean;
  position: number;
};

type ProductRow = {
  id: string;
  slug: string;
  category: ProductCategory;
  tag: string;
  name: string;
  blurb: string;
  description: string;
  brand: string | null;
  specs: unknown;
  is_highlighted: boolean;
  is_published: boolean;
  is_mock: boolean;
  images: ImageRow[] | null;
  variants: VariantRow[] | null;
};

// When Supabase env is absent, public reads return empty so `next build` / a
// misconfigured deploy renders an empty shop rather than crashing.

/** Public URL for an uploaded media object (image or video bucket). */
export function storageMediaUrl(
  path: string,
  mediaType: ProductMediaType,
  isUploaded: boolean,
): string {
  if (!isUploaded) return path; // already a site-relative /public URL
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const bucket = mediaType === "video" ? "product-videos" : "product-images";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function rowToProduct(row: ProductRow): Product {
  const images: ProductImage[] = (row.images ?? [])
    .map((img) => {
      const mediaType: ProductMediaType = img.media_type ?? "image";
      return {
        id: img.id,
        url: storageMediaUrl(img.storage_path, mediaType, img.is_uploaded),
        alt: img.alt || row.name,
        isPrimary: img.is_primary,
        sortOrder: img.sort_order,
        mediaType,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // The primary flag only applies to images; videos never carry it.
  const imageItems = images.filter((i) => i.mediaType === "image");
  const primary = imageItems.find((i) => i.isPrimary) ?? imageItems[0] ?? images[0];

  const variants: ProductVariant[] = (row.variants ?? [])
    .map((v) => ({
      id: v.id,
      label: v.label,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compare_at_price,
      trackInventory: v.track_inventory,
      stockQuantity: v.stock_quantity,
      inStock: variantInStock({
        trackInventory: v.track_inventory,
        stockQuantity: v.stock_quantity,
      }),
      imageId: v.image_id,
      isActive: v.is_active,
      position: v.position,
    }))
    .sort((a, b) => a.position - b.position || a.label.localeCompare(b.label));

  const active = variants.filter((v) => v.isActive);
  const prices = active.map((v) => v.price);
  const priceFrom = prices.length ? Math.min(...prices) : 0;
  const priceTo = prices.length ? Math.max(...prices) : 0;

  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    tag: row.tag,
    name: row.name,
    blurb: row.blurb,
    description: row.description ?? "",
    brand: row.brand,
    specs: Array.isArray(row.specs) ? (row.specs as Product["specs"]) : [],
    images,
    image: primary?.url ?? PLACEHOLDER_IMAGE,
    variants,
    defaultVariant: active[0] ? { ...active[0] } : null,
    priceFrom,
    priceTo,
    inStock: active.some((v) => v.inStock),
    isHighlighted: row.is_highlighted,
    isPublished: row.is_published,
    isMock: row.is_mock,
  };
}

export const getPublishedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    if (!SUPABASE_CONFIGURED) return [];
    const { data, error } = await supabaseAnon
      .from("streetproculture_products")
      .select(PRODUCT_COLUMNS)
      .eq("is_published", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as unknown as ProductRow[]).map(rowToProduct);
  },
  ["published-products"],
  { tags: [PRODUCTS_TAG] },
);

export const getPublishedProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    if (!SUPABASE_CONFIGURED) return null;
    const { data, error } = await supabaseAnon
      .from("streetproculture_products")
      .select(PRODUCT_COLUMNS)
      .eq("is_published", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToProduct(data as unknown as ProductRow) : null;
  },
  ["published-product-by-slug"],
  { tags: [PRODUCTS_TAG] },
);

export const getHighlightedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    if (!SUPABASE_CONFIGURED) return [];
    const { data, error } = await supabaseAnon
      .from("streetproculture_products")
      .select(PRODUCT_COLUMNS)
      .eq("is_published", true)
      .eq("is_highlighted", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as unknown as ProductRow[]).map(rowToProduct);
  },
  ["highlighted-products"],
  { tags: [PRODUCTS_TAG] },
);
