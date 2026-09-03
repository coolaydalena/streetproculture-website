import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { OneRoof } from "@/components/home/one-roof";
import { Brands } from "@/components/home/brands";
import { ArsenalPreview } from "@/components/home/arsenal-preview";
import { PhysicalShop } from "@/components/home/physical-shop";

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
