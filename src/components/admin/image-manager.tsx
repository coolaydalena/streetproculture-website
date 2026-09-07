"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Play, Star, Trash2 } from "lucide-react";
import type { ProductImage } from "@/lib/products";
import { MediaLightbox } from "@/components/ui/media-lightbox";
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {uploaded.map((img, i) => (
          <div
            key={img.id}
            className={`border p-3 ${
              img.isPrimary ? "border-oxblood" : "border-line"
            } ${pending ? "opacity-60" : ""}`}
          >
            <div className="relative aspect-4/5 overflow-hidden bg-line">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={
                  img.mediaType === "video" ? "Play video" : "View full screen"
                }
                className={`block size-full ${
                  img.mediaType === "video" ? "cursor-pointer" : "cursor-zoom-in"
                }`}
              >
                {img.mediaType === "video" ? (
                  <>
                    <video
                      src={`${img.url}#t=0.1`}
                      muted
                      playsInline
                      preload="metadata"
                      tabIndex={-1}
                      className="pointer-events-none size-full object-cover"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-coal/30 text-paper">
                      <Play
                        className="size-8 translate-x-0.5"
                        fill="currentColor"
                      />
                    </span>
                  </>
                ) : (
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 640px) 40vw, 90vw"
                    className="object-cover"
                  />
                )}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {img.mediaType === "video" ? (
                <span className="u-label inline-flex items-center gap-1 text-ink-soft">
                  Video
                </span>
              ) : (
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
              )}
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

      <MediaLightbox
        items={uploaded}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
