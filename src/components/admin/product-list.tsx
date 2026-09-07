"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Search, Star, Trash2 } from "lucide-react";
import type { AdminProduct } from "@/lib/products-admin";
import { formatPrice } from "@/lib/site";
import {
  deleteProduct,
  toggleHighlight,
  togglePublished,
} from "@/lib/actions/products";
import { useToast } from "@/components/ui/toast";

type RowState = "publish" | "highlight" | "delete";

function priceCell(p: AdminProduct): string {
  const active = p.variants.filter((v) => v.isActive);
  if (active.length === 0) return "—";
  return p.priceTo !== p.priceFrom
    ? `${formatPrice(p.priceFrom)} – ${formatPrice(p.priceTo)}`
    : formatPrice(p.priceFrom);
}

function stockCell(p: AdminProduct): string {
  const active = p.variants.filter((v) => v.isActive);
  if (active.length === 0) return "—";
  if (active.some((v) => !v.trackInventory)) return "∞";
  const total = active.reduce((n, v) => n + (v.stockQuantity ?? 0), 0);
  return `${total}${active.length > 1 ? ` · ${active.length} variants` : ""}`;
}

export function ProductList({ products }: { products: AdminProduct[] }) {
  const { push } = useToast();
  const [query, setQuery] = useState("");

  // Rather than copy the server list into state (which needs re-syncing on every
  // refetch), keep the prop as the source of truth and layer local edits on top:
  // `overrides` holds optimistic field patches, `removed` holds deleted ids.
  // Both are harmless no-ops once the server data catches up.
  const [overrides, setOverrides] = useState<
    Record<string, Partial<AdminProduct>>
  >({});
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [rowState, setRowState] = useState<Record<string, RowState>>({});

  const items = useMemo(
    () =>
      products
        .filter((p) => !removed.has(p.id))
        .map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p)),
    [products, overrides, removed],
  );

  const liveCount = items.filter((p) => p.isPublished).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [p.name, p.slug, p.category, p.brand, p.tag]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [items, query]);

  function setBusy(id: string, state: RowState | null) {
    setRowState((prev) => {
      if (state === null) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: state };
    });
  }

  function patch(id: string, fields: Partial<AdminProduct>) {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...fields } }));
  }

  async function toggle(
    p: AdminProduct,
    op: "publish" | "highlight",
    key: "isPublished" | "isHighlighted",
    action: (value: boolean) => Promise<void>,
    messages: [on: string, off: string],
  ) {
    if (rowState[p.id]) return;
    const next = !p[key];
    setBusy(p.id, op);
    patch(p.id, { [key]: next } as Partial<AdminProduct>);
    try {
      await action(next);
      push(next ? messages[0] : messages[1], "success");
    } catch (e) {
      patch(p.id, { [key]: !next } as Partial<AdminProduct>);
      push(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setBusy(p.id, null);
    }
  }

  async function onDelete(p: AdminProduct) {
    if (rowState[p.id]) return;
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusy(p.id, "delete");
    try {
      await deleteProduct(p.id);
      // Drop the row — AnimatePresence fades it out and slides the rest up.
      setRemoved((prev) => new Set(prev).add(p.id));
      push("Product deleted", "success");
    } catch (e) {
      setBusy(p.id, null);
      push(e instanceof Error ? e.message : "Something went wrong", "error");
    }
  }

  return (
    <div>
      <p className="mb-4 text-sm text-ink-soft">
        {items.length} {items.length === 1 ? "product" : "products"} ·{" "}
        {liveCount} live
      </p>

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
          {items.length === 0
            ? "No products yet."
            : `No products match “${query}”.`}
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
              <AnimatePresence initial={false}>
                {visible.map((p) => {
                const state = rowState[p.id];
                const deleting = state === "delete";
                const busy = Boolean(state);
                return (
                  <motion.tr
                    key={p.id}
                    layout="position"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`border-b border-line last:border-0 ${
                      deleting ? "pointer-events-none opacity-40" : ""
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
                    <td className="p-3 font-mono">{priceCell(p)}</td>
                    <td className="p-3">{stockCell(p)}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          toggle(
                            p,
                            "publish",
                            "isPublished",
                            (v) => togglePublished(p.id, v),
                            ["Published", "Unpublished"],
                          )
                        }
                        className={`u-label inline-flex items-center gap-1.5 border px-2 py-1 disabled:cursor-not-allowed ${
                          p.isPublished
                            ? "border-ink bg-ink text-paper"
                            : "border-line text-ink-soft"
                        }`}
                      >
                        {state === "publish" && (
                          <Loader2 className="size-3 animate-spin" />
                        )}
                        {p.isPublished ? "Live" : "Draft"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        disabled={busy}
                        aria-pressed={p.isHighlighted}
                        onClick={() =>
                          toggle(
                            p,
                            "highlight",
                            "isHighlighted",
                            (v) => toggleHighlight(p.id, v),
                            ["Added to home", "Removed from home"],
                          )
                        }
                        className="p-1 disabled:cursor-not-allowed"
                        title="Show on the home page"
                      >
                        {state === "highlight" ? (
                          <Loader2 className="size-4 animate-spin text-ink-soft" />
                        ) : (
                          <Star
                            className={`size-4 ${
                              p.isHighlighted
                                ? "fill-gold text-gold"
                                : "text-ink-soft"
                            }`}
                          />
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onDelete(p)}
                        className="p-1 text-ink-soft hover:text-oxblood disabled:cursor-not-allowed disabled:hover:text-ink-soft"
                        aria-label={`Delete ${p.name}`}
                      >
                        {deleting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
