"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/shop/product-card";

type Filter = ProductCategory | "all";

export function ShopBrowser() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === filter),
    [filter],
  );

  const inStock = visible.filter((p) => p.inStock).length;

  return (
    <>
      <div className="flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`u-label border px-3 py-2 transition-colors ${
                filter === c.id
                  ? "border-oxblood bg-oxblood text-paper"
                  : "border-line hover:border-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="u-label text-ink-soft">
          {inStock} {inStock === 1 ? "unit" : "units"} in stock
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
