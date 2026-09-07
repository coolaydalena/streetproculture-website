/*
 * Turn `scripts/catalog/manifest.json` into SQL you can paste into the Supabase
 * SQL editor (or run with psql):
 *
 *   scripts/catalog/catalog.sql  — upsert every product + variant
 *   scripts/catalog/reset.sql    — delete every product (for a clean reload)
 *
 *   npm run catalog:parse   # (re)build manifest.json from the .xls files
 *   npm run catalog:sql     # emit catalog.sql + reset.sql from the manifest
 *
 * catalog.sql semantics (same as `npm run catalog:import`):
 *   - products matched by slug, inserted unpublished (is_published=false, is_mock=true)
 *   - variants matched by (product_id, label)
 *   - a re-run updates name/category/tag/brand/specs and variant sku/price/position;
 *     it never touches blurb, compare_at_price, stock_quantity, is_active or the
 *     publish flags — those are managed in /admin.
 *
 * For a fully clean reload (drops products renamed/removed upstream): run
 * reset.sql, then catalog.sql.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CATALOG_OUT = join(ROOT, "scripts", "catalog", "catalog.sql");
const RESET_OUT = join(ROOT, "scripts", "catalog", "reset.sql");

type Variant = { label: string; sku: string | null; price: number };
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
) as { generatedAt: string; products: Product[]; parts: Product[] };

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const jsonb = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;
const nullable = (s: string | null) => (s == null || s === "" ? "null" : q(s));

const all = [...manifest.products, ...manifest.parts];
const variantCount = all.reduce((n, p) => n + p.variants.length, 0);

// --- catalog.sql ---------------------------------------------------------
const c: string[] = [
  `-- Street Pro Culture supplier catalogue — generated from`,
  `-- scripts/catalog/manifest.json (${manifest.generatedAt}) by \`npm run catalog:sql\`.`,
  `-- Do not edit by hand.`,
  `--`,
  `-- Idempotent. New products insert unpublished (is_published=false, is_mock=true).`,
  `-- A re-run syncs name/category/tag/brand/specs/blurb/description + variant`,
  `-- sku/price/position; it never changes compare_at_price, stock_quantity,`,
  `-- is_active or the publish flags. (blurb/description are generated here — edit`,
  `-- them in /admin *after* your final catalog.sql run, or they'll be overwritten.)`,
  `-- For a clean reload (drop upstream-removed products): run reset.sql first.`,
  `--`,
  `-- ${all.length} products (${manifest.parts.length} parts), ${variantCount} variants.`,
  ``,
  `begin;`,
  ``,
];

for (const p of all) {
  c.push(
    `-- ${"=".repeat(70)}`,
    `-- ${p.name}  (${p.category}, ${p.variants.length} variant${p.variants.length === 1 ? "" : "s"})`,
    `-- ${"=".repeat(70)}`,
    `insert into public.streetproculture_products`,
    `  (slug, name, category, tag, brand, blurb, description, specs, is_published, is_mock)`,
    `values (${q(p.slug)}, ${q(p.name)}, ${q(p.category)}, ${q(p.tag)}, ${q(p.brand)}, ${q(p.blurb)}, ${q(p.description)}, ${jsonb(p.specs)}, false, true)`,
    `on conflict (slug) do update set`,
    `  name = excluded.name, category = excluded.category, tag = excluded.tag,`,
    `  brand = excluded.brand, blurb = excluded.blurb,`,
    `  description = excluded.description, specs = excluded.specs;`,
    ``,
  );

  p.variants.forEach((v, i) => {
    c.push(
      `insert into public.streetproculture_product_variants`,
      `  (product_id, label, sku, price, compare_at_price, track_inventory, stock_quantity, position, is_active)`,
      `select id, ${q(v.label)}, ${nullable(v.sku)}, ${v.price}, null, true, 0, ${i}, true`,
      `from public.streetproculture_products where slug = ${q(p.slug)}`,
      `on conflict (product_id, label) do update set`,
      `  sku = excluded.sku, price = excluded.price, position = excluded.position;`,
      ``,
    );
  });
}

c.push(`commit;`, ``);
writeFileSync(CATALOG_OUT, c.join("\n"));

// --- reset.sql ---------------------------------------------------------
writeFileSync(
  RESET_OUT,
  [
    `-- Delete every Street Pro Culture product. Run this before catalog.sql for a`,
    `-- fully clean reload (removes products renamed/dropped upstream).`,
    `--`,
    `-- Cascades: streetproculture_product_variants and streetproculture_product_images`,
    `-- rows are removed (ON DELETE CASCADE). streetproculture_order_items keeps its`,
    `-- snapshots — product_id / variant_id just go NULL (ON DELETE SET NULL), so past`,
    `-- orders are unaffected. Uploaded storage objects (if any) are NOT touched.`,
    ``,
    `begin;`,
    `delete from public.streetproculture_products;`,
    `commit;`,
    ``,
  ].join("\n"),
);

console.log(`Wrote ${CATALOG_OUT}`);
console.log(`Wrote ${RESET_OUT}`);
console.log(`  ${all.length} products, ${variantCount} variants`);
