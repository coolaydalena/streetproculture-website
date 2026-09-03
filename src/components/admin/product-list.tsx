"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Search, Star, Trash2 } from "lucide-react";
import type { AdminProduct } from "@/lib/products-admin";
import { formatPrice } from "@/lib/site";
import {
  deleteProduct,
  toggleHighlight,
  togglePublished,
} from "@/lib/actions/products";
import { useToast } from "@/components/ui/toast";

export function ProductList({ products }: { products: AdminProduct[] }) {
  const { push } = useToast();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.slug, p.category, p.brand, p.tag]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [products, query]);

  function run(id: string, fn: () => Promise<unknown>, okMsg: string) {
    setBusyId(id);
    startTransition(async () => {
      try {
        await fn();
        push(okMsg, "success");
      } catch (e) {
        push(e instanceof Error ? e.message : "Something went wrong", "error");
      } finally {
        setBusyId(null);
      }
    });
  }

  function onDelete(p: AdminProduct) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    run(p.id, () => deleteProduct(p.id), "Product deleted");
  }

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full border border-line bg-paper py-2 pl-9 pr-3 text-sm outline-none focus:border-ink"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-ink-soft">
          No products match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="relative overflow-x-auto border border-line">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="p-3 u-label text-ink-soft">Product</th>
                <th className="p-3 u-label text-ink-soft">Category</th>
                <th className="p-3 u-label text-ink-soft">Price</th>
                <th className="p-3 u-label text-ink-soft">Stock</th>
                <th className="p-3 u-label text-ink-soft">Live</th>
                <th className="p-3 u-label text-ink-soft">Home</th>
                <th className="p-3 u-label text-ink-soft">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const rowBusy = pending && busyId === p.id;
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-line last:border-0 ${
                      rowBusy ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden bg-line">
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="u-display text-base hover:text-oxblood"
                          >
                            {p.name}
                          </Link>
                          <p className="font-mono text-xs text-ink-soft">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 capitalize">{p.category}</td>
                    <td className="p-3 font-mono">{formatPrice(p.price)}</td>
                    <td className="p-3">
                      {p.trackInventory ? (p.stockQuantity ?? 0) : "∞"}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() =>
                          run(
                            p.id,
                            () => togglePublished(p.id, !p.isPublished),
                            p.isPublished ? "Unpublished" : "Published",
                          )
                        }
                        className={`u-label border px-2 py-1 ${
                          p.isPublished
                            ? "border-ink bg-ink text-paper"
                            : "border-line text-ink-soft"
                        }`}
                      >
                        {p.isPublished ? "Live" : "Draft"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={rowBusy}
                        aria-pressed={p.isHighlighted}
                        onClick={() =>
                          run(
                            p.id,
                            () => toggleHighlight(p.id, !p.isHighlighted),
                            p.isHighlighted
                              ? "Removed from home"
                              : "Added to home",
                          )
                        }
                        className="p-1"
                        title="Show on the home page"
                      >
                        <Star
                          className={`size-4 ${
                            p.isHighlighted
                              ? "fill-gold text-gold"
                              : "text-ink-soft"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() => onDelete(p)}
                        className="p-1 text-ink-soft hover:text-oxblood"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
