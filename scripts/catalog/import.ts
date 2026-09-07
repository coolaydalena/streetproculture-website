/*
 * Import `scripts/catalog/manifest.json` into Supabase.
 *
 *   npm run catalog:import            # dry run — prints the plan, writes nothing
 *   npm run catalog:import -- --commit # apply
 *
 * Idempotent: products are matched by slug, variants by (product, label).
 * A re-run syncs name / category / tag / brand / blurb / description / specs and
 * variant price + sku + order, and NEVER touches compare_at_price,
 * stock_quantity, is_active or the publish flags — those are the admin's to
 * manage once the catalogue is live. (blurb/description are generated, so edit
 * them in /admin only after the final import.)
 *
 * Uses the service-role key (bypasses RLS). Reads env from .env.local.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const COMMIT = process.argv.includes("--commit");

// --- env ------------------------------------------------------------------
function loadEnv(): Record<string, string> {
  const out: Record<string, string> = { ...process.env } as Record<string, string>;
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on process.env */
  }
  return out;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET =
  env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SECRET) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SECRET, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// --- manifest ------------------------------------------------------------
type Variant = {
  label: string;
  sku: string | null;
  price: number;
  compareAtPrice: null;
  trackInventory: boolean;
  stockQuantity: number;
};
type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  tag: string;
  blurb: string;
  description: string;
  specs: { label: string; value: string }[];
  variants: Variant[];
};

const manifest = JSON.parse(
  readFileSync(join(ROOT, "scripts", "catalog", "manifest.json"), "utf8"),
) as { products: Product[]; parts: Product[] };

const all = [...manifest.products, ...manifest.parts];

// --- import -------------------------------------------------------------
const stats = { productsNew: 0, productsUpdated: 0, variantsNew: 0, variantsUpdated: 0 };

async function upsertProduct(p: Product): Promise<string | null> {
  const { data: existing, error } = await db
    .from("streetproculture_products")
    .select("id")
    .eq("slug", p.slug)
    .maybeSingle();
  if (error) throw error;

  const fields = {
    slug: p.slug,
    name: p.name,
    category: p.category,
    tag: p.tag,
    brand: p.brand,
    blurb: p.blurb,
    description: p.description,
    specs: p.specs,
  };

  if (existing) {
    stats.productsUpdated++;
    if (COMMIT) {
      const { error: e } = await db
        .from("streetproculture_products")
        .update(fields)
        .eq("id", existing.id);
      if (e) throw e;
    }
    return existing.id as string;
  }

  stats.productsNew++;
  if (!COMMIT) return null;
  const { data, error: e } = await db
    .from("streetproculture_products")
    .insert({ ...fields, is_published: false, is_mock: true })
    .select("id")
    .single();
  if (e) throw e;
  return data.id as string;
}

async function upsertVariants(productId: string | null, p: Product): Promise<void> {
  const existing = productId
    ? (
        await db
          .from("streetproculture_product_variants")
          .select("id, label")
          .eq("product_id", productId)
      ).data ?? []
    : [];
  const byLabel = new Map(existing.map((v) => [v.label as string, v.id as string]));

  for (let i = 0; i < p.variants.length; i++) {
    const v = p.variants[i];
    const id = byLabel.get(v.label);
    if (id) {
      stats.variantsUpdated++;
      if (COMMIT) {
        const { error } = await db
          .from("streetproculture_product_variants")
          .update({ sku: v.sku, price: v.price, position: i })
          .eq("id", id);
        if (error) throw error;
      }
    } else {
      stats.variantsNew++;
      if (COMMIT && productId) {
        const { error } = await db
          .from("streetproculture_product_variants")
          .insert({
            product_id: productId,
            label: v.label,
            sku: v.sku,
            price: v.price,
            compare_at_price: null,
            track_inventory: v.trackInventory,
            stock_quantity: v.trackInventory ? v.stockQuantity : null,
            position: i,
            is_active: true,
          });
        if (error) throw error;
      }
    }
  }
}

async function main(): Promise<void> {
  console.log(
    `${COMMIT ? "APPLYING" : "DRY RUN"} — ${all.length} products (${manifest.parts.length} parts)\n`,
  );
  for (const p of all) {
    const id = await upsertProduct(p);
    await upsertVariants(id, p);
  }
  console.log("Products:", stats.productsNew, "new,", stats.productsUpdated, "updated");
  console.log("Variants:", stats.variantsNew, "new,", stats.variantsUpdated, "updated");
  if (!COMMIT) console.log("\nNothing written. Re-run with --commit to apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
