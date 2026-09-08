"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, type Product, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/shop/product-card";

type Filter = ProductCategory | "all";

/** How many cards render on first paint, and how many more each scroll adds. */
const INITIAL_COUNT = 10;
const PAGE_SIZE = 5;

function haystack(p: Product): string {
  return [p.name, p.brand, p.tag, p.blurb, p.description, p.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesQuery(p: Product, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const hay = haystack(p);
  return terms.every((t) => hay.includes(t));
}

export function ShopBrowser({
  products,
  initialFilter = "helmets",
}: {
  products: Product[];
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(INITIAL_COUNT);

  const terms = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  );

  const matched = useMemo(
    () =>
      products.filter(
        (p) =>
          (filter === "all" || p.category === filter) && matchesQuery(p, terms),
      ),
    [filter, products, terms],
  );

  // Any change to the result set starts the window over from the top. Adjusting
  // state during render (rather than in an effect) is the React-sanctioned way
  // to react to a changed input without an extra paint.
  const resultKey = `${filter}::${terms.join(" ")}`;
  const [prevKey, setPrevKey] = useState(resultKey);
  if (prevKey !== resultKey) {
    setPrevKey(resultKey);
    setCount(INITIAL_COUNT);
  }

  const visible = matched.slice(0, count);
  const hasMore = count < matched.length;

  const loadMore = useCallback(() => {
    setCount((c) => Math.min(c + PAGE_SIZE, matched.length));
  }, [matched.length]);

  // Reveal the next page whenever the sentinel scrolls near the viewport. The
  // observer is rebuilt on every `count` change so that, if the sentinel is
  // still in range after a bump (tall viewport, fast scroll), it keeps filling.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, count, loadMore]);

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

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gear"
            aria-label="Search products"
            className="w-full border border-line bg-paper py-2 pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      {matched.length === 0 ? (
        <p className="mt-14 text-ink-soft">
          {query.trim()
            ? `Nothing matches “${query.trim()}”.`
            : "Nothing in this category yet."}
        </p>
      ) : (
        <>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                className="u-label border border-line px-4 py-2 text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
