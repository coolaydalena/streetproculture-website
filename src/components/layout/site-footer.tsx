import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { Checker } from "@/components/ui/primitives";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-coal text-paper">
      <Checker className="text-paper/30" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="u-display text-3xl">
              Street Pro
              <br />
              <span className="text-oxblood">Culture</span>
            </p>
            <p className="u-label mt-4 text-paper/50">Moto Lifestyle</p>
            <p className="mt-4 max-w-sm text-sm text-paper/70">
              {SITE.motto}. Caps and helmets built for the street, made the
              analog way — in {SITE.location.country}.
            </p>
          </div>

          <div>
            <p className="u-label text-paper/50">Explore</p>
            <ul className="mt-4 space-y-3">
              {NAV.filter((n) => n.href !== "/").map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="u-label text-paper/80 transition-colors hover:text-gold"
                  >
                    {item.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="u-label text-paper/50">Connect</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-label text-paper/80 transition-colors hover:text-gold"
                >
                  Facebook ↗
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.upshift}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-label text-paper/80 transition-colors hover:text-gold"
                >
                  Upshift Cafe ↗
                </a>
              </li>
              <li>
                <a
                  href={SITE.location.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-label text-paper/80 transition-colors hover:text-gold"
                >
                  Find us on Maps ↗
                </a>
              </li>
              <li>
                <a
                  href={SITE.location.phoneHref}
                  className="u-label text-paper/80 transition-colors hover:text-gold"
                >
                  {SITE.location.phone}
                </a>
              </li>
              <li className="pt-2 text-xs leading-relaxed text-paper/50">
                {SITE.location.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-2 border-t border-paper/15 pt-6 sm:flex-row">
          <p className="u-label text-paper/50">
            © {year} Street Pro Culture
          </p>
          <p className="u-label text-paper/50">Built for the Street</p>
        </div>
      </div>
    </footer>
  );
}
