export type ProductCategory = "caps" | "helmets" | "cases" | "merch";

export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  tag: string; // e.g. "CAP — 01"
  name: string;
  price: number;
  image: string;
  blurb: string;
  specs: Spec[];
  brand?: string;
  featured?: boolean;
  inStock: boolean;
  /** true for placeholder catalog entries pending real photography/pricing */
  mock?: boolean;
};

const PLACEHOLDER = "/images/products/placeholder.svg";

export const CATEGORIES: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "All Gear" },
  { id: "caps", label: "Caps" },
  { id: "helmets", label: "Helmets" },
  { id: "cases", label: "Cases" },
  { id: "merch", label: "Merch" },
];

export const PRODUCTS: Product[] = [
  // ---- Ported verbatim from the prototype ---------------------------------
  {
    id: "checker-snapback",
    slug: "checker-snapback",
    category: "caps",
    tag: "CAP — 01",
    name: "Checker Snapback",
    price: 38,
    image: "/images/products/checker-snapback.jpg",
    blurb:
      "Structured six-panel in jet black with the woven checker patch. Broken in before you even open the box.",
    specs: [
      { label: "Shell", value: "Wool Blend" },
      { label: "Crown", value: "Structured 6-Panel" },
      { label: "Closure", value: "Metal Snap" },
      { label: "Patch", value: "Woven Checker" },
    ],
    featured: true,
    inStock: true,
  },
  {
    id: "heritage-field-cap",
    slug: "heritage-field-cap",
    category: "caps",
    tag: "CAP — 02",
    name: "Heritage Field Cap",
    price: 36,
    image: "/images/products/heritage-field-cap.jpg",
    blurb:
      "Off-white flat brim with the black badge patch. Ages like a well-kept tank — better every season.",
    specs: [
      { label: "Shell", value: "Cotton Twill" },
      { label: "Brim", value: "Flat, Stitched" },
      { label: "Closure", value: "Metal Snap" },
      { label: "Patch", value: "Black Badge" },
    ],
    featured: true,
    inStock: true,
  },
  {
    id: "trackside-helmet",
    slug: "trackside-helmet",
    category: "helmets",
    tag: "HELMET — 01",
    name: "Trackside Helmet",
    price: 129,
    image: "/images/products/trackside-helmet.jpg",
    blurb:
      "Matte black shell with a single cream stripe. Quiet, heavy, and honest — like a good engine.",
    specs: [
      { label: "Shell", value: "Thermo Alloy" },
      { label: "Visor", value: "Anti-Scratch Clear" },
      { label: "Lining", value: "Moisture-Wick" },
      { label: "Weight", value: "1.1 kg" },
    ],
    inStock: true,
  },
  {
    id: "oxblood-runner",
    slug: "oxblood-runner",
    category: "helmets",
    tag: "HELMET — 02",
    name: "Oxblood Runner",
    price: 139,
    image: "/images/products/oxblood-runner.jpg",
    blurb:
      "Deep oxblood shell with a cream racing stripe. For riders who want the paint to remember every ride.",
    specs: [
      { label: "Shell", value: "Thermo Alloy" },
      { label: "Visor", value: "Anti-Scratch Clear" },
      { label: "Lining", value: "Removable, Washable" },
      { label: "Weight", value: "1.15 kg" },
    ],
    inStock: true,
  },

  // ---- Mock catalog — brands & merch (placeholder art / pricing) ---------
  {
    id: "cgm-italia-full-face",
    slug: "cgm-italia-full-face",
    category: "helmets",
    tag: "HELMET — 03",
    name: "CGM Italia Full-Face",
    price: 189,
    image: PLACEHOLDER,
    blurb:
      "Italian-made full-face from CGM. ECE-rated shell, drop-down sun visor, built for daily street miles.",
    specs: [
      { label: "Brand", value: "CGM Italia" },
      { label: "Cert", value: "ECE 22.06" },
      { label: "Visor", value: "Clear + Internal Sun" },
      { label: "Sizes", value: "XS – XXL" },
    ],
    brand: "CGM Italia",
    inStock: true,
    mock: true,
  },
  {
    id: "nzi-fibra-open-face",
    slug: "nzi-fibra-open-face",
    category: "helmets",
    tag: "HELMET — 04",
    name: "NZI Fibra Open-Face",
    price: 165,
    image: PLACEHOLDER,
    blurb:
      "Fibreglass open-face from NZI. Lightweight lay-up, retro profile, bubble-visor ready.",
    specs: [
      { label: "Brand", value: "NZI Fibra" },
      { label: "Shell", value: "Fibreglass" },
      { label: "Weight", value: "0.95 kg" },
      { label: "Visor", value: "Bubble (opt.)" },
    ],
    brand: "NZI Fibra",
    inStock: true,
    mock: true,
  },
  {
    id: "xland-top-case-45l",
    slug: "xland-top-case-45l",
    category: "cases",
    tag: "CASE — 01",
    name: "X-land Top Case 45L",
    price: 119,
    image: PLACEHOLDER,
    blurb:
      "Hard-shell 45-litre top case from X-land. Full-face fit, quick-release mount, keyed lock.",
    specs: [
      { label: "Brand", value: "X-land" },
      { label: "Volume", value: "45 L" },
      { label: "Mount", value: "Quick-Release" },
      { label: "Lock", value: "Keyed" },
    ],
    brand: "X-land",
    inStock: true,
    mock: true,
  },
  {
    id: "ozracing-riding-tee",
    slug: "ozracing-riding-tee",
    category: "merch",
    tag: "MERCH — 01",
    name: "OZ Racing Moto Tee",
    price: 32,
    image: PLACEHOLDER,
    blurb:
      "Heavyweight cotton tee from the OZ Racing moto-lifestyle line. Screen-printed, pre-shrunk.",
    specs: [
      { label: "Brand", value: "OZ Racing" },
      { label: "Fabric", value: "240gsm Cotton" },
      { label: "Print", value: "Water-Based Screen" },
      { label: "Sizes", value: "S – XXL" },
    ],
    brand: "OZ Racing",
    inStock: true,
    mock: true,
  },
  {
    id: "spc-sticker-pack",
    slug: "spc-sticker-pack",
    category: "merch",
    tag: "MERCH — 02",
    name: "Culture Sticker Pack",
    price: 8,
    image: PLACEHOLDER,
    blurb:
      "Six die-cut vinyl stickers — badge, wordmark, checker, bolt. Weatherproof, tank-safe.",
    specs: [
      { label: "Count", value: "6 Pieces" },
      { label: "Material", value: "Cast Vinyl" },
      { label: "Finish", value: "Matte, UV-Safe" },
      { label: "Cut", value: "Die-Cut" },
    ],
    inStock: true,
    mock: true,
  },
  {
    id: "spc-woven-patch",
    slug: "spc-woven-patch",
    category: "merch",
    tag: "MERCH — 03",
    name: "Heritage Woven Patch",
    price: 12,
    image: PLACEHOLDER,
    blurb:
      "Iron-on woven badge patch. The same one that goes on the Heritage Field Cap.",
    specs: [
      { label: "Size", value: "70 mm" },
      { label: "Weave", value: "High-Density" },
      { label: "Backing", value: "Iron-On" },
      { label: "Border", value: "Merrowed" },
    ],
    inStock: true,
    mock: true,
  },
];

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
