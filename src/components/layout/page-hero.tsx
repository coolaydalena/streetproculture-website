import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/primitives";

export function PageHero({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <header className="border-b border-line bg-paper pt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Kicker className="text-oxblood">{kicker}</Kicker>
        <h1 className="u-display mt-5 text-[clamp(3rem,10vw,8rem)]">{title}</h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">{intro}</p>
        )}
      </div>
    </header>
  );
}
