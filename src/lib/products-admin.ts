import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rowToProduct } from "@/lib/products-db";
import type { Product } from "@/lib/products";

// CMS reads — drafts included, never cached. RLS requires the caller to be a
// superadmin; the calling page/action also runs requireSuperadmin().

const ADMIN_PRODUCT_COLUMNS = `
  id, slug, category, tag, name, price, blurb, brand, specs,
  track_inventory, stock_quantity, is_highlighted, is_published, is_mock,
  created_at, updated_at,
  images:streetproculture_product_images (
    id, storage_path, is_uploaded, alt, sort_order, is_primary
  )
`;

export type AdminProduct = Product & {
  createdAt: string;
  updatedAt: string;
};

export async function listProductsForAdmin(): Promise<AdminProduct[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("streetproculture_products")
    .select(ADMIN_PRODUCT_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...rowToProduct(row as never),
    createdAt: (row as { created_at: string }).created_at,
    updatedAt: (row as { updated_at: string }).updated_at,
  }));
}

export async function getProductForAdmin(
  id: string,
): Promise<AdminProduct | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("streetproculture_products")
    .select(ADMIN_PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...rowToProduct(data as never),
    createdAt: (data as { created_at: string }).created_at,
    updatedAt: (data as { updated_at: string }).updated_at,
  };
}
