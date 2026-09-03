"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Star, Trash2 } from "lucide-react";
import type { ProductImage } from "@/lib/products";
import {
  deleteProductImage,
  reorderImages,
  setPrimaryImage,
} from "@/lib/actions/products";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { useToast } from "@/components/ui/toast";

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const { push } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const uploaded = images.filter((i) => i.id !== "fallback");

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
    const next = [...uploaded];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    act(
      () => reorderImages(productId, next.map((i) => i.id)),
      "Order updated",
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {uploaded.map((img, i) => (
          <div
            key={img.id}
            className={`border p-3 ${
              img.isPrimary ? "border-oxblood" : "border-line"
            } ${pending ? "opacity-60" : ""}`}
          >
            <div className="relative aspect-4/5 overflow-hidden bg-line">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  act(
                    () => setPrimaryImage(productId, img.id),
                    "Primary image set",
                  )
                }
                disabled={img.isPrimary}
                className="u-label inline-flex items-center gap-1 disabled:opacity-100"
              >
                <Star
                  className={`size-4 ${
                    img.isPrimary ? "fill-gold text-gold" : "text-ink-soft"
                  }`}
                />
                {img.isPrimary ? "Primary" : "Set primary"}
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === uploaded.length - 1}
                  className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    act(
                      () => deleteProductImage(productId, img.id),
                      "Image deleted",
                    )
                  }
                  className="p-1 text-ink-soft hover:text-oxblood"
                  aria-label="Delete image"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageDropzone productId={productId} />
    </div>
  );
}
