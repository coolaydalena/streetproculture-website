import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { OneRoof } from "@/components/home/one-roof";
import { Brands } from "@/components/home/brands";
import { ArsenalPreview } from "@/components/home/arsenal-preview";
import { PhysicalShop } from "@/components/home/physical-shop";

// Explicit self-canonical for "/". Without it Next emits no canonical tag on the
// home page, leaving Google to infer the URL — and it had indexed the naked
// http://streetprocultureph.com/ form. Resolves against metadataBase (the
// https://www host) to the full canonical URL.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <OneRoof />
      <Brands />
      <ArsenalPreview />
      <PhysicalShop />
    </>
  );
}
