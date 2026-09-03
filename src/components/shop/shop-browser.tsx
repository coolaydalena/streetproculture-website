"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type Product, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/shop/product-card";

type Filter = ProductCategory | "all";

export function ShopBrowser({
  products,
  initialFilter = "all",
}: {
  products: Product[];
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const visible = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((p) => p.category === filter),
    [filter, products],
  );

  const inStock = visible.filter((p) => p.inStock).length;

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-line pt-4 pb-12 sm:flex-row sm:items-center sm:justify-between">
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

      {visible.length === 0 ? (
        <p className="mt-14 text-ink-soft">Nothing in this category yet.</p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
