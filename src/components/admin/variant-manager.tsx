"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ProductImage, ProductVariant } from "@/lib/products";
import { variantFormSchema } from "@/lib/validation/product";
import {
  addVariant,
  deleteVariant,
  reorderVariants,
  setVariantImage,
  updateVariant,
} from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function VariantManager({
  productId,
  variants,
  images,
}: {
  productId: string;
  variants: ProductVariant[];
  images: ProductImage[];
}) {
  const { push } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const photos = images.filter((i) => i.mediaType === "image");
  const ordered = [...variants].sort((a, b) => a.position - b.position);

  function act(fn: () => Promise<unknown>, okMsg: string) {
    startTransition(async () => {
      try {
        await fn();
        push(okMsg, "success");
        router.refresh();
      } catch (e) {
        push(e instanceof Error ? e.message : "Something went wrong", "error");
      }
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...ordered];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    act(() => reorderVariants(productId, next.map((v) => v.id)), "Order updated");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {ordered.map((v, i) => (
          <VariantRow
            key={v.id}
            variant={v}
            photos={photos}
            disabled={pending}
            isOnly={ordered.length === 1}
            onMoveUp={i > 0 ? () => move(i, -1) : undefined}
            onMoveDown={i < ordered.length - 1 ? () => move(i, 1) : undefined}
            onImage={(imageId) =>
              act(
                () => setVariantImage(productId, v.id, imageId),
                "Variant image set",
              )
            }
            onDelete={() =>
              act(() => deleteVariant(productId, v.id), "Variant removed")
            }
          />
        ))}
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          act(async () => {
            const res = await addVariant(productId);
            if (!res.ok) throw new Error(res.error ?? "Could not add variant");
          }, "Variant added")
        }
        className="u-label inline-flex items-center gap-1 border border-line px-3 py-2 hover:border-ink"
      >
        <Plus className="size-3.5" /> Add variant
      </button>
    </div>
  );
}

function VariantRow({
  variant,
  photos,
  disabled,
  isOnly,
  onMoveUp,
  onMoveDown,
  onImage,
  onDelete,
}: {
  variant: ProductVariant;
  photos: ProductImage[];
  disabled: boolean;
  isOnly: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onImage: (imageId: string | null) => void;
  onDelete: () => void;
}) {
  const { push } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [label, setLabel] = useState(variant.label);
  const [sku, setSku] = useState(variant.sku ?? "");
  const [price, setPrice] = useState(String(variant.price));
  const [compareAt, setCompareAt] = useState(
    variant.compareAtPrice == null ? "" : String(variant.compareAtPrice),
  );
  const [trackInventory, setTrackInventory] = useState(variant.trackInventory);
  const [stockQuantity, setStockQuantity] = useState(
    variant.stockQuantity == null ? "" : String(variant.stockQuantity),
  );
  const [isActive, setIsActive] = useState(variant.isActive);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function save() {
    const values = {
      label: label.trim(),
      sku: sku.trim(),
      price: Number(price),
      compareAtPrice: compareAt.trim() === "" ? null : Number(compareAt),
      trackInventory,
      stockQuantity:
        !trackInventory || stockQuantity.trim() === ""
          ? null
          : Number(stockQuantity),
      isActive,
    };
    const parsed = variantFormSchema.safeParse(values);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    startTransition(async () => {
      const res = await updateVariant(variant.id, parsed.data);
      if (res.ok) {
        push("Variant saved", "success");
        router.refresh();
      } else if (res.fieldErrors) {
        setErrors(res.fieldErrors);
      } else {
        push(res.error ?? "Could not save variant", "error");
      }
    });
  }

  const busy = disabled || pending;
  const input =
    "w-full border border-line bg-paper-card px-2 py-1.5 text-sm outline-none focus:border-oxblood";

  return (
    <div className={`border border-line p-4 ${busy ? "opacity-60" : ""}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="u-label text-ink-soft">Label</span>
          <input
            className={input}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          {errors.label && (
            <span className="mt-1 block text-oxblood">{errors.label}</span>
          )}
        </label>
        <label className="text-xs">
          <span className="u-label text-ink-soft">SKU</span>
          <input
            className={input}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="u-label text-ink-soft">Price (₱)</span>
          <input
            className={input}
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && (
            <span className="mt-1 block text-oxblood">{errors.price}</span>
          )}
        </label>
        <label className="text-xs">
          <span className="u-label text-ink-soft">Compare-at (₱)</span>
          <input
            className={input}
            type="number"
            min={0}
            step={1}
            placeholder="—"
            value={compareAt}
            onChange={(e) => setCompareAt(e.target.value)}
          />
          {errors.compareAtPrice && (
            <span className="mt-1 block text-oxblood">
              {errors.compareAtPrice}
            </span>
          )}
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={trackInventory}
            onChange={(e) => setTrackInventory(e.target.checked)}
          />
          <span className="u-label text-ink-soft">Track inventory</span>
        </label>
        {trackInventory && (
          <label className="text-xs">
            <span className="u-label text-ink-soft">Stock</span>
            <input
              className={input}
              type="number"
              min={0}
              step={1}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
            {errors.stockQuantity && (
              <span className="mt-1 block text-oxblood">
                {errors.stockQuantity}
              </span>
            )}
          </label>
        )}
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span className="u-label text-ink-soft">Active (buyable)</span>
        </label>
        <label className="text-xs">
          <span className="u-label text-ink-soft">Represented by image</span>
          <select
            className={input}
            value={variant.imageId ?? ""}
            onChange={(e) => onImage(e.target.value || null)}
          >
            <option value="">Product default</option>
            {photos.map((img, idx) => (
              <option key={img.id} value={img.id}>
                {img.alt || `Image ${idx + 1}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Button type="button" onClick={save} disabled={busy}>
          Save variant
        </Button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp || busy}
            className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!onMoveDown || busy}
            className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isOnly || busy}
            title={isOnly ? "A product needs at least one variant" : "Delete variant"}
            className="p-1 text-ink-soft hover:text-oxblood disabled:opacity-30"
            aria-label="Delete variant"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
