import type { Metadata } from "next";
import { Saira_Condensed, Special_Elite, Cousine } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CheckoutFlowProvider } from "@/lib/checkout-flow";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GrainOverlay } from "@/components/layout/grain-overlay";
import { CartOverlay } from "@/components/shop/cart-overlay";
import { ToastProvider } from "@/components/ui/toast";
import { SITE_URL } from "@/lib/site";
import { getPublishedProducts } from "@/lib/products-db";
import { getUser, isSuperadmin } from "@/lib/auth";

const saira = Saira_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const elite = Special_Elite({
  variable: "--font-elite",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Cousine — a Courier New / Courier Prime metric-compatible slab mono that,
// unlike Courier Prime, actually ships a ₱ peso-sign glyph (U+20B1, emitted by
// formatPrice()). The glyph lives in the latin-ext subset.
const cousine = Cousine({
  variable: "--font-mono-face",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Street Pro Culture — Built for the Street",
    template: "%s — Street Pro Culture",
  },
  description:
    "Godly • Good • Goods. Caps, helmets and moto gear built for the street. Physical store, PMS service and cafe in the Philippines.",
  openGraph: {
    title: "Street Pro Culture — Built for the Street",
    description:
      "Caps, helmets and moto gear built for the street. Store, PMS service and cafe in the Philippines.",
    url: SITE_URL,
    siteName: "Street Pro Culture",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, user, superadmin] = await Promise.all([
    getPublishedProducts(),
    getUser(),
    isSuperadmin(),
  ]);

  const auth = {
    signedIn: !!user,
    isSuperadmin: superadmin,
    name:
      (user?.user_metadata?.full_name as string | undefined) ??
      (user?.user_metadata?.name as string | undefined) ??
      user?.email ??
      null,
  };

  return (
    <html
      lang="en"
      className={`${saira.variable} ${elite.variable} ${cousine.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <ToastProvider>
          <CartProvider products={products}>
            <CheckoutFlowProvider>
              <GrainOverlay />
              <SiteHeader auth={auth} />
              <main className="flex-1">{children}</main>
              <SiteFooter />
              <CartOverlay />
            </CheckoutFlowProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
