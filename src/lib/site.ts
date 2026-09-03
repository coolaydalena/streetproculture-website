export const SITE = {
  name: "Street Pro Culture",
  tagline: "Built for the Street",
  motto: "Godly • Good • Goods",
  url: "https://streetproculture.com",
  // Physical location — PLACEHOLDER, awaiting real address / hours from the client.
  location: {
    line: "Metro Manila, Philippines",
    country: "Philippines",
    hours: "Tue – Sun · 10:00 – 19:00",
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

// Prototype prices are shown in USD ($). Kept as-is for a faithful port;
// flip `CURRENCY` / `LOCALE` here when the real PHP catalog lands.
export const CURRENCY = "USD";
export const LOCALE = "en-US";

// Online checkout is deferred until Paymongo is wired up. While false the
// checkout form renders but its submit button stays disabled.
export const CHECKOUT_ENABLED = false;

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
  }).format(amount);
}
