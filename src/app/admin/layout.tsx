import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { requireSuperadmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSuperadmin();

  return (
    <div className="bg-paper pt-16">
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="u-display text-xl">
              SPC Studio
            </Link>
            <Link
              href="/admin/products"
              className="u-label text-ink-soft hover:text-ink"
            >
              Products
            </Link>
          </div>
          <Link href="/" className="u-label text-ink-soft hover:text-oxblood">
            ← Back to site
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
