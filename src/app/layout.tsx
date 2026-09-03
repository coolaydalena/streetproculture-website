import type { Metadata } from "next";
import { Saira_Condensed, Special_Elite, Courier_Prime } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CheckoutFlowProvider } from "@/lib/checkout-flow";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GrainOverlay } from "@/components/layout/grain-overlay";
import { CartOverlay } from "@/components/shop/cart-overlay";
import { SITE } from "@/lib/site";

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

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
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
    url: SITE.url,
    siteName: "Street Pro Culture",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${saira.variable} ${elite.variable} ${courier.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <CartProvider>
          <CheckoutFlowProvider>
            <GrainOverlay />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <CartOverlay />
          </CheckoutFlowProvider>
        </CartProvider>
      </body>
    </html>
  );
}
