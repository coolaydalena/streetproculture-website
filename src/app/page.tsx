import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { Heritage } from "@/components/home/heritage";
import { ArsenalPreview } from "@/components/home/arsenal-preview";
import { Pillars } from "@/components/home/pillars";
import { PhysicalShop } from "@/components/home/physical-shop";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Heritage />
      <ArsenalPreview />
      <Pillars />
      <PhysicalShop />
    </>
  );
}
