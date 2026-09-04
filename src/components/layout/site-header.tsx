"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { useCart } from "@/lib/store/cart-store";
import { useCartUI } from "@/lib/store/cart-ui-store";

export type HeaderAuth = {
  signedIn: boolean;
  isSuperadmin: boolean;
  name: string | null;
};

export function SiteHeader({ auth }: { auth: HeaderAuth }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, hydrated } = useCart();
  const openCart = useCartUI((s) => s.openCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid bar everywhere except the top of the home hero.
  const solid = !isHome || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-paper/95 text-ink backdrop-blur"
          : "border-b border-transparent! bg-transparent text-paper"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={SITE.name}>
          <Image
            src="/images/logos/badge-color.jpg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
            priority
          />
          <span className="u-display text-lg leading-none tracking-tight">
            Street Pro <span className="text-oxblood">Culture</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-bold u-label transition-opacity hover:opacity-100 ${
                  active ? "opacity-100" : "opacity-60"
                }`}
              >
                {item.label}
                {active && (
                  <span className="mt-1 block h-px w-full bg-current" />
                )}
              </Link>
            );
          })}
          {auth.isSuperadmin && (
            <Link
              href="/admin"
              className={`font-bold u-label text-oxblood transition-opacity hover:opacity-100 ${
                pathname.startsWith("/admin") ? "opacity-100" : "opacity-80"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {auth.signedIn ? (
            <Link
              href="/account"
              className="hidden items-center gap-2 p-2 opacity-80 transition-opacity hover:opacity-100 sm:flex"
              aria-label="Your account"
            >
              <User className="size-5" strokeWidth={1.75} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden u-label p-2 opacity-80 transition-opacity hover:opacity-100 sm:block"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-2 p-2 opacity-80 transition-opacity hover:opacity-100"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-5" strokeWidth={1.75} />
            <span className="u-label tabular-nums">{hydrated ? count : 0}</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-paper text-ink lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="u-label border-b border-line py-4 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            {auth.isSuperadmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="u-label border-b border-line py-4 text-oxblood"
              >
                Admin
              </Link>
            )}
            {auth.signedIn ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="u-label border-b border-line py-4"
                >
                  Account
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="u-label w-full border-b border-line py-4 text-left"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="u-label border-b border-line py-4"
              >
                Login
              </Link>
            )}
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="u-label py-4"
            >
              Facebook ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
