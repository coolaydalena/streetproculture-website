import Image from "next/image";
import { Cta, Kicker } from "@/components/ui/primitives";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-coal text-paper">
      <Image
        src="/images/home/hero-road.jpg"
        alt="Rider on an open desert highway at dusk"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/50 to-coal/20" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <Kicker className="text-gold">Est. on the open road</Kicker>
        <h1 className="u-display mt-6 text-[clamp(3.5rem,13vw,11rem)]">
          Chase the
          <br />
          Horizon
        </h1>
        <p className="mt-6 max-w-md text-base text-paper/75">
          Gear tested by distance, not focus groups.
        </p>
        <div className="mt-10">
          <Cta href="/shop">Shop the Gear</Cta>
        </div>
      </div>

      <span className="u-label absolute bottom-6 left-1/2 -translate-x-1/2 text-paper/50">
        Scroll ↓
      </span>
    </section>
  );
}
