import "server-only";

import { unstable_cache } from "next/cache";
import { supabaseAnon } from "@/lib/supabase/anon";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/env";
import {
  PLACEHOLDER_IMAGE,
  productInStock,
  type Product,
  type ProductImage,
  type ProductCategory,
} from "@/lib/products";

/** Cache tag revalidated by every CMS mutation (`revalidateTag(PRODUCTS_TAG, "max")`). */
export const PRODUCTS_TAG = "products";

const PRODUCT_COLUMNS = `
  id, slug, category, tag, name, price, blurb, brand, specs,
  track_inventory, stock_quantity, is_highlighted, is_published, is_mock,
  images:streetproculture_product_images (
    id, storage_path, is_uploaded, alt, sort_order, is_primary
  )
`;

type ImageRow = {
  id: string;
  storage_path: string;
  is_uploaded: boolean;
  alt: string;
  sort_order: number;
  is_primary: boolean;
};

type ProductRow = {
  id: string;
  slug: string;
  category: ProductCategory;
  tag: string;
  name: string;
  price: number;
  blurb: string;
  brand: string | null;
  specs: unknown;
  track_inventory: boolean;
  stock_quantity: number | null;
  is_highlighted: boolean;
  is_published: boolean;
  is_mock: boolean;
  images: ImageRow[] | null;
};

// When Supabase env is absent, public reads return empty so `next build` / a
// misconfigured deploy renders an empty shop rather than crashing.

export function storageImageUrl(path: string, isUploaded: boolean): string {
  if (!isUploaded) return path; // already a site-relative /public URL
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

export function rowToProduct(row: ProductRow): Product {
  const images: ProductImage[] = (row.images ?? [])
    .map((img) => ({
      id: img.id,
      url: storageImageUrl(img.storage_path, img.is_uploaded),
      alt: img.alt || row.name,
      isPrimary: img.is_primary,
      sortOrder: img.sort_order,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const primary = images.find((i) => i.isPrimary) ?? images[0];

  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    tag: row.tag,
    name: row.name,
    price: row.price,
    blurb: row.blurb,
    brand: row.brand,
    specs: Array.isArray(row.specs) ? (row.specs as Product["specs"]) : [],
    images,
    image: primary?.url ?? PLACEHOLDER_IMAGE,
    trackInventory: row.track_inventory,
    stockQuantity: row.stock_quantity,
    inStock: productInStock({
      trackInventory: row.track_inventory,
      stockQuantity: row.stock_quantity,
    }),
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
