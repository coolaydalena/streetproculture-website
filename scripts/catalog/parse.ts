/*
 * Parse the supplier price lists in `Price list and photos/` into a reviewable
 * `scripts/catalog/manifest.json`. Run: `npm run catalog:parse`.
 *
 * Grouping (confirmed with the client):
 *   - group by *family*, single flat variant axis (no colour x size grid)
 *   - CGM/SKAP: family = numeric prefix + model word ("333 ONYX", "3MH SPEEDER")
 *   - NZI: family = model ("ATTO DUO", "GIGA", "ONE BIT")
 *   - X-Land: one product per case series (H / M / Y / S)
 *   - visors / pinlocks / cushions -> category "parts", one product each
 *
 * Prices are the STORE SRP column (whole pesos). compare_at_price is left null —
 * the "20% Discount" column is the reseller margin, not a customer promo.
 *
 * `specs` are accumulated across every row of a family (shell materials, pinlock
 * support, visor system, capacity, dimensions...) — they are the data the
 * storefront derives all its SEO from (`src/lib/product-seo.ts`).
 */
import * as XLSX from "xlsx";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { DESCRIPTIONS, partCopy } from "./descriptions";

const SRC = join(process.cwd(), "Price list and photos");
const OUT = join(process.cwd(), "scripts", "catalog", "manifest.json");

type Row = (string | number | null)[];

type ManifestVariant = {
  label: string;
  sku: string | null;
  price: number;
  compareAtPrice: null;
  trackInventory: true;
  stockQuantity: 0;
};
type ManifestProduct = {
  slug: string;
  name: string;
  brand: string;
  category: "helmets" | "cases" | "parts";
  tag: string;
  blurb: string;
  description: string;
  specs: { label: string; value: string }[];
  variants: ManifestVariant[];
};

function sheetRows(file: string): Row[] {
  const wb = XLSX.readFile(join(SRC, file));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Row>(sheet, { header: 1, raw: true });
}

const str = (v: unknown): string => (v == null ? "" : String(v).trim());
const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\bAnd\b/g, "and");
}

const TINT_ORDER = ["clear", "smoke", "iridium"];
function sortTints(tints: string[]): string[] {
  return [...tints].sort(
    (a, b) =>
      TINT_ORDER.findIndex((t) => a.toLowerCase().includes(t)) -
      TINT_ORDER.findIndex((t) => b.toLowerCase().includes(t)),
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// Free-text facts collected per family while scanning rows; turned into `specs`
// once the whole sheet is read.
type Facts = {
  helmetType?: string;
  shells: Set<string>;
  pinlock?: string;
  visorSystem?: boolean;
  capacities: Set<number>;
  dims: Set<string>;
  // parts
  fits?: string;
  partType?: string;
  finishes: Set<string>;
  profiles: Set<string>;
};

class Catalog {
  private map = new Map<string, ManifestProduct>();
  private facts = new Map<string, Facts>();

  private ensure(p: Omit<ManifestProduct, "variants" | "specs" | "description">): {
    product: ManifestProduct;
    facts: Facts;
  } {
    let product = this.map.get(p.slug);
    if (!product) {
      product = { ...p, description: "", specs: [], variants: [] };
      this.map.set(p.slug, product);
      this.facts.set(p.slug, {
        shells: new Set(),
        capacities: new Set(),
        dims: new Set(),
        finishes: new Set(),
        profiles: new Set(),
      });
    }
    return { product, facts: this.facts.get(p.slug)! };
  }

  add(
    p: Omit<ManifestProduct, "variants" | "specs" | "description">,
    v: ManifestVariant,
    fill?: (f: Facts) => void,
  ): void {
    const { product, facts } = this.ensure(p);
    if (!product.variants.some((x) => x.label === v.label)) {
      product.variants.push(v);
    }
    fill?.(facts);
  }

  /** Build `specs` from the accumulated facts, then return the product list. */
  list(): ManifestProduct[] {
    for (const p of this.map.values()) {
      const f = this.facts.get(p.slug)!;
      const specs: { label: string; value: string }[] = [];
      const push = (label: string, value: string) => {
        if (value) specs.push({ label, value });
      };

      if (p.category === "helmets") {
        push("Type", f.helmetType ?? "");
        push("Shell", [...f.shells].sort().join(" / "));
        push("Pinlock", f.pinlock ?? "");
        push("Visor", f.visorSystem ? "Long-visor & Shape-visor options" : "");
      } else if (p.category === "cases") {
        const caps = [...f.capacities].sort((a, b) => a - b);
        push("Capacity", caps.length ? `${caps.join(" / ")} L` : "");
        push("Shell", [...f.shells].sort().join(" / "));
        const dims = [...f.dims].sort();
        push(
          "External size",
          dims.length > 1 ? `${dims[0]} – ${dims[dims.length - 1]} cm` : dims[0] ? `${dims[0]} cm` : "",
        );
      } else {
        push("Type", f.partType ?? "");
        push("Fits", f.fits ?? "");
        if (f.finishes.size) push("Tints", sortTints([...f.finishes]).join(", "));
        if (f.profiles.size)
          push("Visor profile", [...f.profiles].sort().join(", "));
      }
      p.specs = specs;

      // Merge in the authored / generated copy.
      if (p.category === "parts") {
        const copy = partCopy(p.name, {
          fits: f.fits ?? "our helmets",
          type: f.partType ?? "",
          tints: sortTints([...f.finishes]),
          profiles: [...f.profiles].sort(),
        });
        p.blurb = copy.blurb;
        p.description = copy.description;
      } else {
        const copy = DESCRIPTIONS[p.slug];
        if (!copy) {
          console.warn(`⚠ no DESCRIPTIONS entry for "${p.slug}"`);
        } else {
          p.blurb = copy.blurb;
          p.description = copy.description;
        }
      }
    }
    return [...this.map.values()];
  }
}

// ---------------------------------------------------------------------------
// Shell / pinlock normalisation (CGM columns)
// ---------------------------------------------------------------------------
function normShell(raw: string): string {
  const s = raw.toLowerCase();
  if (/carbon/.test(s)) return "Carbon";
  if (/fiber|fibre/.test(s)) return "Fibreglass";
  if (/terpolymer/.test(s)) return "High-Performance Terpolymer";
  if (/aluminum|aluminium/.test(s)) {
    const gauge = raw.match(/([\d.]+)\s*mm/i)?.[1];
    return gauge ? `${gauge} mm aluminium alloy` : "Aluminium alloy";
  }
  if (/plastic/.test(s)) return "Hard plastic";
  return titleCase(raw);
}

function pinlockOf(col4: string, col5: string, code: string): string | undefined {
  if (/fog city/i.test(col4)) return "Fog City anti-fog insert included";
  if (/^yes$/i.test(col5)) return "Pinlock 70 lens included";
  if (/optional/i.test(col5))
    return code ? `Pinlock 70 ready — lens ${code} (optional)` : "Pinlock 70 ready";
  if (/^yes$/i.test(col4) && code) return `Pinlock 70 ready — lens ${code}`;
  return undefined;
}

// ---------------------------------------------------------------------------
// X-Land — motorcycle top cases
// ---------------------------------------------------------------------------
const XLAND_SERIES: Record<string, string> = {
  S: "X-Land S-Series Top Case",
  H: "X-Land H-Series Aluminium Top Case",
  M: "X-Land M-Series Aluminium Top Case",
  Y: "X-Land Y-Series Aluminium Top Case",
};

function parseXLand(cat: Catalog): void {
  for (const row of sheetRows("X-Land Price List.xls")) {
    const sku = str(row[0]);
    const name = str(row[1]);
    const price = num(row[3]);
    if (!sku || price == null) continue;

    if (sku === "BC" || /cushion/i.test(name)) {
      cat.add(
        {
          slug: "x-land-top-case-back-cushion",
          name: "X-Land Top Case Back Cushion",
          brand: "X-Land",
          category: "parts",
          tag: "X-LAND",
          blurb: "",
        },
        { label: "Default", sku, price, compareAtPrice: null, trackInventory: true, stockQuantity: 0 },
        (f) => {
          f.fits = "X-Land H / M / Y-Series aluminium top cases";
          f.partType = "Padded backrest";
        },
      );
      continue;
    }

    const series = sku.split("-")[0].toUpperCase();
    const productName = XLAND_SERIES[series];
    if (!productName) {
      console.warn(`X-Land: unrecognised series "${series}" (${sku})`);
      continue;
    }

    const parts = name.split(" - ").map((s) => s.trim());
    const liters = parts[0].match(/(\d+)\s*L\b/i)?.[1] ?? "";
    const colour = titleCase(parts[1] ?? "");
    const label = [liters ? `${liters}L` : "", colour].filter(Boolean).join(" ");
    const dim = name.match(/\((\d+)\s*[xX]\s*(\d+)\s*[xX]\s*(\d+)\s*CM\)/);

    cat.add(
      { slug: slugify(productName), name: productName, brand: "X-Land", category: "cases", tag: "X-LAND", blurb: "" },
      { label: label || name, sku, price, compareAtPrice: null, trackInventory: true, stockQuantity: 0 },
      (f) => {
        if (liters) f.capacities.add(Number(liters));
        if (parts[2]) f.shells.add(normShell(parts[2].replace(/\s*\([^)]*\)\s*/, "").trim()));
        if (dim) f.dims.add(`${dim[1]}×${dim[2]}×${dim[3]}`);
      },
    );
  }
}

// ---------------------------------------------------------------------------
// NZI Fibra — helmets
// ---------------------------------------------------------------------------
const NZI_FAMILIES = ["ATTO DUO", "EXA DUO", "BYTE STREAM", "ONE BIT", "GIGA"];

function stripVisorSuffix(s: string): string {
  return s
    .replace(/\s*\+?\s*CLEAR\s*\+?\s*CLEAR VISOR\s*$/i, "")
    .replace(/\s*TINTED\s*\+\s*CLEAR VISOR\s*$/i, "")
    .replace(/\s*\+\s*CLEAR VISOR\s*$/i, "")
    .replace(/\s*CLEAR\s*$/i, "")
    .trim();
}

function parseNZI(cat: Catalog): void {
  let section = "";
  for (const row of sheetRows("NZI Fibra Price List.xls")) {
    const sku = str(row[0]);
    const name = str(row[1]);
    const price = num(row[3]);

    if (!sku && name && price == null) {
      section = name;
      continue;
    }
    if (!sku || price == null) continue;

    if (/PARTS/i.test(section)) {
      // All the REF.xxx clear visors → one product, one variant per helmet model.
      const model = name
        .replace(/^REF\.\d+\s+/i, "")
        .replace(/\s*\/.*$/, "")
        .replace(/CLEAR VISOR/i, "")
        .trim();
      const helmet =
        /atto/i.test(model) ? "Atto Duo"
        : /exa/i.test(model) ? "Exa Duo"
        : /giga/i.test(model) ? "Giga"
        : /byte/i.test(model) ? "Byte Stream"
        : titleCase(model) || "Universal";
      cat.add(
        {
          slug: "nzi-fibra-clear-visor",
          name: "NZI Fibra Clear Visor",
          brand: "NZI",
          category: "parts",
          tag: "NZI",
          blurb: "",
        },
        {
          label: helmet,
          sku,
          price,
          compareAtPrice: null,
          trackInventory: true,
          stockQuantity: 0,
        },
        (f) => {
          f.partType = "Replacement outer visor";
          f.fits = "NZI Fibra Atto Duo, Exa Duo, Giga and Byte Stream helmets";
          f.finishes.add("Clear");
        },
      );
      continue;
    }

    const bare = name.replace(/^NZI FIBRA\s+/i, "");
    const family = NZI_FAMILIES.find((f) => bare.toUpperCase().startsWith(f));
    if (!family) {
      console.warn(`NZI: no family match for "${name}"`);
      continue;
    }
    const rest = stripVisorSuffix(bare.slice(family.length).trim());
    const productName = `NZI Fibra ${titleCase(family)}`;

    cat.add(
      { slug: slugify(productName), name: productName, brand: "NZI", category: "helmets", tag: "NZI", blurb: "" },
      {
        label: titleCase(rest) || "Default",
        sku,
        price,
        compareAtPrice: null,
        trackInventory: true,
        stockQuantity: 0,
      },
      (f) => {
        if (section)
          f.helmetType = titleCase(section.replace(/^NZI FIBRA HELMET\s+/i, ""));
        f.shells.add("Fibreglass");
      },
    );
  }
}

// ---------------------------------------------------------------------------
// CGM — CGM + SKAP helmets, plus a parts section
// ---------------------------------------------------------------------------
function cgmHelmetType(section: string): string {
  const s = section.toUpperCase();
  if (s.includes("MODULAR")) return "Modular (flip-up)";
  if (s.includes("JET")) return "Jet / open-face";
  if (s.includes("FULL FACE")) return "Full-face";
  return "";
}

// Lens code → the helmet it belongs to (for the grouped Pinlock 70 product).
const PINLOCK_FITS: Record<string, string> = {
  DKS002CGMCL: "Standard fit — most CGM & SKAP helmets",
  DKS442: "361 Avent Pro",
  DKS413: "560 Mad",
};

function tintOf(desc: string): string {
  if (/iridium/i.test(desc)) return "Iridium mirror";
  if (/smoke/i.test(desc)) return "Smoke 50%";
  if (/transparent|clear/i.test(desc)) return "Clear";
  return "";
}

function parseCGM(cat: Catalog): void {
  let brand = "CGM";
  let section = "";
  let inParts = false;
  // familyCode ("361", "3MH") → { brand, name } from the helmet rows, so the
  // parts section can name visors after their helmet ("CGM 361 Avent Visor").
  const familyByCode = new Map<string, { brand: string; name: string }>();

  for (const row of sheetRows("CGM Price List.xls")) {
    const col0 = str(row[0]);
    const col1 = str(row[1]);
    const col2 = str(row[2]);
    const shell = str(row[3]);
    const col4 = str(row[4]);
    const col5 = str(row[5]);
    const col6 = str(row[6]);
    const partPrice = num(row[8]);

    // Section headers sit in col1 with an empty col0 and no price.
    if (!col0 && col1 && partPrice == null) {
      section = col1;
      inParts = /PARTS/i.test(col1);
      brand = /^SKAP/i.test(col1) ? "SKAP" : "CGM";
      continue;
    }
    if (!col0 || partPrice == null) continue;

    if (inParts) {
      const desc = col2 || col0;
      const V = {
        label: "Default",
        sku: col0,
        price: partPrice,
        compareAtPrice: null as null,
        trackInventory: true as const,
        stockQuantity: 0 as const,
      };

      // --- Pinlock 70 lens — one product, one variant per lens code ---------
      if (/pinlock/i.test(desc)) {
        cat.add(
          {
            slug: "cgm-pinlock-70-lens",
            name: "CGM Pinlock 70 Anti-Fog Lens",
            brand: "CGM",
            category: "parts",
            tag: "CGM",
            blurb: "",
          },
          { ...V, label: PINLOCK_FITS[col0] ?? col0 },
          (f) => {
            f.partType = "Pinlock 70 anti-fog visor insert";
            f.fits =
              "CGM & SKAP helmets marked Pinlock-70 ready (see the helmet's spec sheet)";
          },
        );
        continue;
      }

      // --- Fog City anti-fog insert ---------------------------------------
      if (/fog city/i.test(desc)) {
        cat.add(
          {
            slug: "cgm-fog-city-insert",
            name: "CGM Fog City Anti-Fog Insert",
            brand: "CGM",
            category: "parts",
            tag: "CGM",
            blurb: "",
          },
          V,
          (f) => {
            f.partType = "Stick-on anti-fog insert";
            f.fits = "CGM 311 Blast";
          },
        );
        continue;
      }

      // --- Visor — one product per helmet model, one variant per tint -------
      if (/visor/i.test(desc)) {
        const tail = desc.split(" - ").pop()!.trim(); // "361" | "167 Long"
        const m = tail.match(/^([0-9A-Za-z]+)(?:\s+(Long|Shape))?$/i);
        const base = (m?.[1] ?? tail).toUpperCase();
        const profile = m?.[2] ? `${titleCase(m[2])} visor` : "";
        const fam = familyByCode.get(base);
        const visorBrand = fam?.brand ?? "CGM";
        const modelName = fam?.name ?? `${visorBrand} ${base}`;
        const tint = tintOf(desc) || "Clear";

        cat.add(
          {
            slug: slugify(`${modelName} visor`),
            name: `${modelName} Visor`,
            brand: visorBrand,
            category: "parts",
            tag: visorBrand.toUpperCase(),
            blurb: "",
          },
          { ...V, label: profile ? `${tint} — ${profile}` : tint },
          (f) => {
            f.partType = "Replacement outer visor";
            f.fits = fam ? `${modelName} helmet` : `${visorBrand} ${base} helmet`;
            f.finishes.add(tint);
            if (profile) f.profiles.add(profile);
          },
        );
        continue;
      }

      // --- Anything else — keep as a standalone product -------------------
      const name = titleCase(desc);
      cat.add(
        { slug: slugify(name), name, brand: "CGM", category: "parts", tag: "CGM", blurb: "" },
        V,
        (f) => {
          f.fits = "CGM helmets";
        },
      );
      continue;
    }

    // Helmet row: col1 = "333A ONYX SPORT", col2 = colour, col8 = SRP.
    const tokens = col1.split(/\s+/);
    const code = tokens[0]; // "333A", "3MHA", "361C"
    const modelWord = tokens[1] ?? "";
    const lineWords = tokens.slice(2);
    const familyCode = code.replace(/[A-Z]$/, "");
    const family = `${familyCode} ${modelWord}`.trim();
    const productName = `${brand} ${family}`;
    if (modelWord && !familyByCode.has(familyCode)) {
      familyByCode.set(familyCode, {
        brand,
        name: `${brand} ${familyCode} ${titleCase(modelWord)}`,
      });
    }

    const line = titleCase(lineWords.join(" "));
    const visor = /visor/i.test(col4) ? col4.trim() : "";
    const label =
      [line, titleCase(col2)].filter(Boolean).join(" — ") +
      (visor ? ` (${titleCase(visor)})` : "");

    cat.add(
      {
        slug: slugify(productName),
        name: productName,
        brand,
        category: "helmets",
        tag: brand.toUpperCase(),
        blurb: "",
      },
      {
        label: label || col2 || "Default",
        sku: col0,
        price: partPrice,
        compareAtPrice: null,
        trackInventory: true,
        stockQuantity: 0,
      },
      (f) => {
        f.helmetType ||= cgmHelmetType(section);
        if (shell) f.shells.add(normShell(shell));
        if (visor) f.visorSystem = true;
        else f.pinlock ??= pinlockOf(col4, col5, col6);
      },
    );
  }
}

// ---------------------------------------------------------------------------
function main(): void {
  const cat = new Catalog();
  parseXLand(cat);
  parseNZI(cat);
  parseCGM(cat);

  const all = cat.list();
  const products = all.filter((p) => p.category !== "parts");
  const parts = all.filter((p) => p.category === "parts");

  const manifest = { generatedAt: new Date().toISOString(), products, parts };
  writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");

  const variantCount = all.reduce((n, p) => n + p.variants.length, 0);
  console.log(`Wrote ${OUT}`);
  console.log(
    `  ${products.length} products, ${parts.length} parts, ${variantCount} variants total`,
  );
  for (const p of all) {
    console.log(
      `  ${p.category.padEnd(7)} ${p.slug.padEnd(38)} ${p.variants.length}v  specs: ${p.specs.map((s) => s.label).join(", ")}`,
    );
  }
}

main();
