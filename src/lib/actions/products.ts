"use server";

import { refresh, revalidateTag } from "next/cache";
import { requireSuperadmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PRODUCTS_TAG } from "@/lib/products-db";
import {
  productFormSchema,
  toProductRow,
  type ProductFormValues,
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
  const { data: images } = await supabase
    .from("streetproculture_product_images")
    .select("storage_path, is_uploaded")
    .eq("product_id", id);

  const paths = (images ?? [])
    .filter((i) => i.is_uploaded)
    .map((i) => i.storage_path);
  if (paths.length > 0) {
    await supabase.storage.from("product-images").remove(paths);
  }

  const { error } = await supabase
    .from("streetproculture_products")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProducts();
  refresh();
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
  revalidateProducts();
  refresh();
}

export async function toggleHighlight(id: string, value: boolean) {
  await setProductFlag(id, "is_highlighted", value);
}

export async function togglePublished(id: string, value: boolean) {
  await setProductFlag(id, "is_published", value);
}

// --------------------------------------------------------------------------
// Images
// --------------------------------------------------------------------------
export async function addProductImage(input: {
  productId: string;
  storagePath: string;
  alt?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await assertSuperadmin();

  const { data: existing, error: countErr } = await supabase
    .from("streetproculture_product_images")
    .select("id, sort_order")
    .eq("product_id", input.productId)
    .order("sort_order", { ascending: false });

  if (countErr) return { ok: false, error: countErr.message };

  const isFirst = (existing ?? []).length === 0;
  const nextOrder = isFirst ? 0 : (existing![0].sort_order ?? 0) + 1;

  const { error } = await supabase
    .from("streetproculture_product_images")
    .insert({
      product_id: input.productId,
      storage_path: input.storagePath,
      is_uploaded: true,
      alt: input.alt ?? "",
      sort_order: nextOrder,
      is_primary: isFirst,
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
    .from("streetproculture_product_images")
    .update({ is_primary: false })
    .eq("product_id", productId)
    .eq("is_primary", true);
  if (clearErr) throw new Error(clearErr.message);

  const { error } = await supabase
    .from("streetproculture_product_images")
    .update({ is_primary: true })
    .eq("id", imageId)
    .eq("product_id", productId);
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
        .from("streetproculture_product_images")
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

  const { data: img } = await supabase
    .from("streetproculture_product_images")
    .select("storage_path, is_uploaded")
    .eq("id", imageId)
    .maybeSingle();

  const { error } = await supabase
    .from("streetproculture_product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId);
  if (error) throw new Error(error.message);

  if (img?.is_uploaded) {
    await supabase.storage.from("product-images").remove([img.storage_path]);
  }

  revalidateProducts();
}
