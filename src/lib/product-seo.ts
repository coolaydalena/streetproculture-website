// Dynamic SEO for product pages — every artifact (meta description, keywords,
// JSON-LD) is derived from the product's structured data. No stored prose.
// Dependency-free (site.ts + products.ts are both client-safe) so it can be
// used from `generateMetadata`, the page body and the OG image route.

import { categoryLabel, type Product, type ProductCategory } from "@/lib/products";
import { formatPrice } from "@/lib/site";

const CATEGORY_NOUNS: Record<ProductCategory, string> = {
  helmets: "motorcycle helmet",
  cases: "motorcycle top case",
  parts: "replacement part",
  caps: "cap",
  merch: "apparel",
};

export function categoryNoun(category: ProductCategory): string {
  return CATEGORY_NOUNS[category] ?? "product";
}

function activeVariants(product: Product) {
  return product.variants.filter((v) => v.isActive);
}

/** Price as a single figure or a "₱X–₱Y" range. */
export function priceRangeLabel(product: Product): string {
  return product.priceFrom === product.priceTo
    ? formatPrice(product.priceFrom)
    : `${formatPrice(product.priceFrom)}–${formatPrice(product.priceTo)}`;
}

/**
 * Distinct colourway phrases across the active variants — the text after the
 * "—" in a helmet label ("Sport — Nero Rosso Opaco" → "Nero Rosso Opaco") or the
 * label minus a leading size ("45L Black" → "Black"). Original casing kept.
 */
export function colourPhrases(product: Product): string[] {
  const seen = new Map<string, string>();
  for (const v of activeVariants(product)) {
    const label = v.label ?? "";
    let c = label.includes("—")
      ? label.slice(label.lastIndexOf("—") + 1)
      : label;
    c = c
      .replace(/\([^)]*\)/g, "") // drop "(Long Visor)"
      .replace(/^\s*\d+\s*L\s+/i, "") // drop "45L "
      .trim();
    if (c && !seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), c);
  }
  return [...seen.values()];
}

/** ≤158-char meta description — `blurb` when set, otherwise derived. */
export function productMetaDescription(product: Product): string {
  const blurb = (product.blurb ?? "").trim();
  if (blurb) return blurb;

  const noun = categoryNoun(product.category);
  const n = activeVariants(product).length;
  const optionWord = product.category === "helmets" ? "colourways" : "options";
  const specBit = product.specs
    .slice(0, 2)
    .map((s) => s.value)
    .join(", ");

  const parts = [
    `${product.name} ${noun}${n > 1 ? ` — ${n} ${optionWord}` : ""}.`,
    specBit ? `${specBit}.` : "",
    `${product.inStock ? "In stock" : "Available"} at Street Pro Culture, Paco, Manila.`,
  ].filter(Boolean);

  const s = parts.join(" ");
  return s.length > 158 ? `${s.slice(0, 155).trimEnd()}…` : s;
}

/** A fuller paragraph for the JSON-LD `description` — the real copy when set. */
export function productLdDescription(product: Product): string {
  const authored = (product.description ?? "").trim();
  if (authored) {
    return authored.replace(/\s*\n\s*/g, " ");
  }
  const noun = categoryNoun(product.category);
  const n = activeVariants(product).length;
  const brand = product.brand ? `${product.brand} ` : "";
  const optionWord = product.category === "helmets" ? "colourways" : "options";
  const colourBit =
    n > 1
      ? ` Available in ${n} ${optionWord}: ${colourPhrases(product).slice(0, 8).join(", ")}.`
      : "";
  const specBit = product.specs
    .map((s) => `${s.label.toLowerCase()} ${s.value}`)
    .join(", ");
  const specSentence = specBit ? ` Key specs — ${specBit}.` : "";
  return (
    `${product.name} is a ${brand}${noun}.` +
    colourBit +
    specSentence +
    ` Sold by Street Pro Culture, a motorcycle gear store in Paco, Manila —` +
    ` in-store pickup or nationwide delivery, pay by GCash, Maya, GrabPay, card or cash.`
  );
}

export function productKeywords(product: Product): string[] {
  const out = new Set<string>();
  for (const w of (product.name ?? "").split(/\s+/)) if (w.length > 1) out.add(w);
  if (product.brand) out.add(product.brand);
  out.add(categoryNoun(product.category));
  out.add(categoryLabel(product.category));
  for (const c of colourPhrases(product).slice(0, 4)) out.add(c);
  out.add("Philippines");
  out.add("Manila");
  return [...out];
}

const IN_STOCK = "https://schema.org/InStock";
const OUT_OF_STOCK = "https://schema.org/OutOfStock";
const NEW = "https://schema.org/NewCondition";

/** Full schema.org `Product` object for the detail page. */
export function productJsonLd(
  product: Product,
  opts: { url: string; images: string[]; sellerName: string },
): Record<string, unknown> {
  const active = activeVariants(product);
  const overall = product.inStock ? IN_STOCK : OUT_OF_STOCK;
  const seller = { "@type": "Organization", name: opts.sellerName };
  const shell = product.specs.find((s) => s.label === "Shell")?.value;
  const colours = colourPhrases(product);

  const offers: Record<string, unknown> =
    active.length > 1
      ? {
          "@type": "AggregateOffer",
          url: opts.url,
          priceCurrency: "PHP",
          lowPrice: product.priceFrom,
          highPrice: product.priceTo,
          offerCount: active.length,
          availability: overall,
          seller,
          offers: active.map((v) => ({
            "@type": "Offer",
            name: `${product.name} — ${v.label}`,
            ...(v.sku ? { sku: v.sku } : {}),
            price: v.price,
            priceCurrency: "PHP",
            itemCondition: NEW,
            availability: v.inStock ? IN_STOCK : OUT_OF_STOCK,
            url: opts.url,
          })),
        }
      : {
          "@type": "Offer",
          url: opts.url,
          priceCurrency: "PHP",
          price: product.priceFrom,
          itemCondition: NEW,
          availability: overall,
          ...(active[0]?.sku ? { sku: active[0].sku } : {}),
          seller,
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productLdDescription(product),
    image: opts.images,
    sku: product.defaultVariant?.sku ?? product.slug,
    category: categoryLabel(product.category),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(shell ? { material: shell } : {}),
    ...(colours.length ? { color: colours } : {}),
    ...(product.specs.length
      ? {
          additionalProperty: product.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
    offers,
  };
}
