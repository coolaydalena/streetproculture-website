import Image from "next/image";
import { Cta, Kicker } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/site";

export function PhysicalShop() {
  return (
    <section className="relative overflow-hidden bg-coal py-24 text-paper sm:py-32">
      <Image
        src="/images/home/one-roof.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <Kicker className="justify-center text-gold">The Physical Shop</Kicker>
          <h2 className="u-display mx-auto mt-5 max-w-2xl text-[clamp(2.5rem,7vw,5rem)]">
            Where the Culture Lives.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-paper/75">
            Visit us for fitting, custom patches, and shop-only drops. The coffee
            is bad, the company is good.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Cta href="/visit">Plan a Visit</Cta>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="u-label inline-flex items-center gap-2 border border-paper/40 px-6 py-3 transition-colors hover:bg-paper hover:text-coal"
            >
              Find us on Facebook ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
