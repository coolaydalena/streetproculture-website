export const SITE = {
  name: "Street Pro Culture",
  tagline: "Built for the Street",
  motto: "Godly • Good • Goods",
  url: "https://streetproculture.com",
  location: {
    line: "Paco, Manila",
    address:
      "P&R Mansion Unit 105, 1515 Sto. Sepulcro St. cor. Pres. Quirino Ave., Brgy. 682, Paco, Manila 1007, Philippines",
    country: "Philippines",
    hours: "Daily · 8:00 AM – 5:00 PM",
    phone: "+63 987 654 3210",
    phoneHref: "tel:+639876543210",
    map: "https://maps.app.goo.gl/2SeLJ3EUCt49RsDq8",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61555906356217",
    upshift: "https://www.facebook.com/share/1GiySP87L3/?mibextid=wwXIfr",
  },
} as const;

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Cafe", href: "/cafe" },
  { label: "Brands", href: "/brands" },
  { label: "Visit", href: "/visit" },
];

// Store currency. Product amounts in `src/lib/products.ts` are placeholder
// figures pending the real catalogue.
export const CURRENCY = "PHP";
export const LOCALE = "en-PH";

// Online checkout is deferred until Paymongo is wired up. While false the
// checkout form renders but its submit button stays disabled.
export const CHECKOUT_ENABLED = false;

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}
