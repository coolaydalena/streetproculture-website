"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Cta, Kicker } from "@/components/ui/primitives";

type Slide = {
  id: string;
  image: string;
  alt: string;
  kicker: string;
  title: ReactNode;
  copy: string;
  cta: { label: string; href: string };
};

/**
 * Hero slides. Add events, drops, or campaigns here — the carousel picks up
 * new entries automatically and loops through them.
 */
const SLIDES: Slide[] = [
  {
    id: "storefront",
    image: "/images/home/hero/shop.webp",
    alt: "Street Pro Culture storefront on the corner of Sto. Sepulcro St. and Pres. Quirino Ave., Paco, Manila",
    kicker: "Paco, Manila",
    title: (
      <>
        Come by
        <br />
        the Shop
      </>
    ),
    copy: "P&R Mansion, Sto. Sepulcro cor. Pres. Quirino Ave. — pull up and see the gear in person.",
    cta: { label: "Visit the Shop", href: "/visit" },
  },
  {
    id: "after-dark",
    image: "/images/home/hero/scooter-night.webp",
    alt: "Red Royal Alloy scooter parked outside the Street Pro Culture shop at night",
    kicker: "After dark",
    title: (
      <>
        Ride to
        <br />
        the Light
      </>
    ),
    copy: "The shop stays lit after hours — riders roll through all night.",
    cta: { label: "Shop the Gear", href: "/shop" },
  },
  {
    id: "daily-workhorse",
    image: "/images/home/hero/helmet-underpass.webp",
    alt: "CGM Italia modular helmet resting on a Royal Alloy GP180 with a 55L X-Land top box, parked under a Manila overpass",
    kicker: "Royal Alloy GP180",
    title: (
      <>
        Our Daily
        <br />
        Workhorse
      </>
    ),
    copy: "The Royal Alloy GP180 on everyday kit — CGM modular helmet, 55L X-Land top box, OZ Racing balaclava and gloves, RESO comms. Bikes aren't weekend toys; ride gear that works as hard as you do.",
    cta: { label: "Shop the Gear", href: "/shop" },
  },
];

const INTERVAL = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay — always looping. Skipped only for users who ask for reduced
  // motion, who get a static hero instead.
  useEffect(() => {
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduceMotion || SLIDES.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
    // Re-arm on every slide change so a manual dot tap still gets a full
    // interval before the next auto-advance.
  }, [index]);

  const active = SLIDES[index];

  return (
    <section
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-coal text-paper"
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover opacity-70 ${i === index ? "hero-zoom" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/50 to-coal/20" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div key={active.id} className="hero-rise">
          <Kicker className="text-gold">{active.kicker}</Kicker>
          <h1 className="u-display mt-6 text-[clamp(3.5rem,13vw,11rem)]">
            {active.title}
          </h1>
          <p className="mt-6 max-w-md text-base text-paper/75">{active.copy}</p>
          <div className="mt-10">
            <Cta href={active.cta.href}>{active.cta.label}</Cta>
          </div>
        </div>
      </div>

      {SLIDES.length > 1 && (
        <div className="absolute bottom-6 right-4 z-10 flex items-center gap-1.5 sm:right-6 lg:right-8">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              // Keep a mouse click from scrolling the button into view; Tab
              // focus still works for keyboard users.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              className="flex h-8 w-8 items-center justify-center"
            >
              <span
                className={`block h-1 w-7 transition-colors ${
                  i === index ? "bg-paper" : "bg-paper/30 hover:bg-paper/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <span className="u-label absolute bottom-6 left-1/2 -translate-x-1/2 text-paper/50">
        Scroll ↓
      </span>
    </section>
  );
}
