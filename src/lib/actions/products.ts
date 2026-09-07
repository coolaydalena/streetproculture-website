"use server";

import { revalidateTag } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PRODUCTS_TAG } from "@/lib/products-db";
import type { ProductMediaType } from "@/lib/products";
import {
  productFormSchema,
  toProductRow,
  variantFormSchema,
  toVariantRow,
  type ProductFormValues,
  type VariantFormValues,
} from "@/lib/validation/product";

export type ProductActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  productId?: string;
};

function flattenFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function revalidateProducts() {
  revalidateTag(PRODUCTS_TAG, "max");
}

async function assertSuperadmin() {
  await requireSuperadmin();
  return createSupabaseServerClient();
}

const IMAGES = "streetproculture_product_images";
const VARIANTS = "streetproculture_product_variants";

function bucketFor(mediaType: ProductMediaType): string {
  return mediaType === "video" ? "product-videos" : "product-images";
}

// --------------------------------------------------------------------------
// Create
// --------------------------------------------------------------------------
export async function createProduct(
  _prev: ProductActionState,
  values: ProductFormValues,
): Promise<ProductActionState> {
  const supabase = await assertSuperadmin();

  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error.issues) };
  }

  const { data, error } = await supabase
    .from("streetproculture_products")
    .insert(toProductRow(parsed.data))
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, fieldErrors: { slug: "That slug is already taken" } };
    }
    return { ok: false, error: error.message };
  }

  // A product always needs at least one variant. Seed a placeholder the admin
  // then prices/renames in the variant manager.
  const { error: variantError } = await supabase.from(VARIANTS).insert({
    product_id: data.id as string,
    label: "Default",
    price: 0,
    track_inventory: false,
    stock_quantity: null,
    position: 0,
    is_active: true,
  });
  if (variantError) return { ok: false, error: variantError.message };

  revalidateProducts();
  return { ok: true, productId: data.id as string };
}

// --------------------------------------------------------------------------
// Update
// --------------------------------------------------------------------------
export async function updateProduct(
  _prev: ProductActionState,
  payload: ProductFormValues & { id: string },
): Promise<ProductActionState> {
  const supabase = await assertSuperadmin();

  const { id, ...values } = payload;
  if (!id) return { ok: false, error: "Missing product id" };

  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error.issues) };
  }

  const { error } = await supabase
    .from("streetproculture_products")
    .update(toProductRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, fieldErrors: { slug: "That slug is already taken" } };
    }
    return { ok: false, error: error.message };
  }

  revalidateProducts();
  return { ok: true, productId: id };
}

// --------------------------------------------------------------------------
// Delete
// --------------------------------------------------------------------------
export async function deleteProduct(id: string): Promise<void> {
  const supabase = await assertSuperadmin();

  // Remove uploaded storage objects first (rows cascade on product delete).
  const { data: media } = await supabase
    .from(IMAGES)
    .select("storage_path, is_uploaded, media_type")
    .eq("product_id", id);

  const byBucket = new Map<string, string[]>();
  for (const m of media ?? []) {
    if (!m.is_uploaded) continue;
    const bucket = bucketFor((m.media_type ?? "image") as ProductMediaType);
    byBucket.set(bucket, [...(byBucket.get(bucket) ?? []), m.storage_path]);
  }
  for (const [bucket, paths] of byBucket) {
    if (paths.length > 0) await supabase.storage.from(bucket).remove(paths);
  }

  const { error } = await supabase
    .from("streetproculture_products")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  // No refresh() here — the list page manages its own row state so the admin
  // stays put instead of the whole tree re-rendering and jumping to the top.
  revalidateProducts();
}

// --------------------------------------------------------------------------
// Quick toggles (from the list page)
// --------------------------------------------------------------------------
async function setProductFlag(
  id: string,
  column: "is_highlighted" | "is_published",
  value: boolean,
): Promise<void> {
  const supabase = await assertSuperadmin();
  const { error } = await supabase
    .from("streetproculture_products")
    .update({ [column]: value })
    .eq("id", id);
  if (error) throw new Error(error.message);
  // No refresh() — the list page patches the row itself (see product-list.tsx).
  revalidateProducts();
}

export async function toggleHighlight(id: string, value: boolean) {
  await setProductFlag(id, "is_highlighted", value);
}

export async function togglePublished(id: string, value: boolean) {
  await setProductFlag(id, "is_published", value);
}

// --------------------------------------------------------------------------
// Variants
// --------------------------------------------------------------------------
export async function addVariant(
  productId: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await assertSuperadmin();

  const { data: existing, error: countErr } = await supabase
    .from(VARIANTS)
    .select("id, position")
    .eq("product_id", productId)
    .order("position", { ascending: false });
  if (countErr) return { ok: false, error: countErr.message };

  const nextPos =
    (existing ?? []).length === 0 ? 0 : (existing![0].position ?? 0) + 1;

  const { error } = await supabase.from(VARIANTS).insert({
    product_id: productId,
    label: `Variant ${(existing ?? []).length + 1}`,
    price: 0,
    track_inventory: false,
    stock_quantity: null,
    position: nextPos,
    is_active: true,
  });
  if (error) return { ok: false, error: error.message };

  revalidateProducts();
  return { ok: true };
}

export async function updateVariant(
  variantId: string,
  values: VariantFormValues,
): Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string> }> {
  const supabase = await assertSuperadmin();

  const parsed = variantFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenFieldErrors(parsed.error.issues) };
  }

  const { error } = await supabase
    .from(VARIANTS)
    .update(toVariantRow(parsed.data))
    .eq("id", variantId);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, fieldErrors: { label: "Another variant already uses that label" } };
    }
    return { ok: false, error: error.message };
  }

  revalidateProducts();
  return { ok: true };
}

export async function deleteVariant(
  productId: string,
  variantId: string,
): Promise<void> {
  const supabase = await assertSuperadmin();

  const { data: rows, error: countErr } = await supabase
    .from(VARIANTS)
    .select("id")
    .eq("product_id", productId);
  if (countErr) throw new Error(countErr.message);
  if ((rows ?? []).length <= 1) {
    throw new Error("A product needs at least one variant.");
  }

  const { error } = await supabase
    .from(VARIANTS)
    .delete()
    .eq("id", variantId)
    .eq("product_id", productId);
  if (error) throw new Error(error.message);

  revalidateProducts();
}

export async function reorderVariants(
  productId: string,
  orderedIds: string[],
): Promise<void> {
  const supabase = await assertSuperadmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from(VARIANTS)
        .update({ position: index })
        .eq("id", id)
        .eq("product_id", productId),
    ),
  );

  revalidateProducts();
}

export async function setVariantImage(
  productId: string,
  variantId: string,
  imageId: string | null,
): Promise<void> {
  const supabase = await assertSuperadmin();
  const { error } = await supabase
    .from(VARIANTS)
    .update({ image_id: imageId })
    .eq("id", variantId)
    .eq("product_id", productId);
  if (error) throw new Error(error.message);
  revalidateProducts();
}

// --------------------------------------------------------------------------
// Media (images + videos)
// --------------------------------------------------------------------------
export async function addProductMedia(input: {
  productId: string;
  storagePath: string;
  mediaType: ProductMediaType;
  alt?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await assertSuperadmin();

  const { data: existing, error: countErr } = await supabase
    .from(IMAGES)
    .select("id, sort_order, media_type")
    .eq("product_id", input.productId)
    .order("sort_order", { ascending: false });

  if (countErr) return { ok: false, error: countErr.message };

  const rows = existing ?? [];
  const nextOrder = rows.length === 0 ? 0 : (rows[0].sort_order ?? 0) + 1;
  // First image (not video) becomes the primary.
  const isFirstImage =
    input.mediaType === "image" &&
    !rows.some((r) => (r.media_type ?? "image") === "image");

  const { error } = await supabase.from(IMAGES).insert({
    product_id: input.productId,
    storage_path: input.storagePath,
    is_uploaded: true,
    media_type: input.mediaType,
    alt: input.alt ?? "",
    sort_order: nextOrder,
    is_primary: isFirstImage,
  });

  if (error) return { ok: false, error: error.message };

  revalidateProducts();
  return { ok: true };
}

export async function setPrimaryImage(
  productId: string,
  imageId: string,
): Promise<void> {
  const supabase = await assertSuperadmin();

  // Clear the current primary first so the partial unique index never conflicts.
  const { error: clearErr } = await supabase
    .from(IMAGES)
    .update({ is_primary: false })
    .eq("product_id", productId)
    .eq("is_primary", true);
  if (clearErr) throw new Error(clearErr.message);

  const { error } = await supabase
    .from(IMAGES)
    .update({ is_primary: true })
    .eq("id", imageId)
    .eq("product_id", productId)
    .eq("media_type", "image");
  if (error) throw new Error(error.message);

  revalidateProducts();
}

export async function reorderImages(
  productId: string,
  orderedIds: string[],
): Promise<void> {
  const supabase = await assertSuperadmin();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from(IMAGES)
        .update({ sort_order: index })
        .eq("id", id)
        .eq("product_id", productId),
    ),
  );

  revalidateProducts();
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  const supabase = await assertSuperadmin();

  const { data: media } = await supabase
    .from(IMAGES)
    .select("storage_path, is_uploaded, media_type")
    .eq("id", imageId)
    .maybeSingle();

  const { error } = await supabase
    .from(IMAGES)
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId);
  if (error) throw new Error(error.message);

  if (media?.is_uploaded) {
    const bucket = bucketFor((media.media_type ?? "image") as ProductMediaType);
    await supabase.storage.from(bucket).remove([media.storage_path]);
  }

  revalidateProducts();
}
