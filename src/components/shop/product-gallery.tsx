"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Play } from "lucide-react";
import type { ProductImage } from "@/lib/products";
import { SITE } from "@/lib/site";
import { usePdpStore } from "@/lib/store/pdp-store";

export function ProductGallery({
  productId,
  images,
  fallback,
  name,
  category,
  tag,
}: {
  productId: string;
  images: ProductImage[];
  fallback: string;
  name: string;
  category: string;
  tag: string;
}) {
  const gallery: ProductImage[] =
    images.length > 0
      ? images
      : [
          {
            id: "fallback",
            url: fallback,
            alt: name,
            isPrimary: true,
            sortOrder: 0,
            mediaType: "image",
          },
        ];

  const primary = gallery.find((i) => i.isPrimary) ?? gallery[0];
  const { productId: activeProductId, activeMediaId, select } = usePdpStore();

  // Default the shared selection to this product's primary media on mount.
  useEffect(() => {
    select(productId, primary.id);
  }, [productId, primary.id, select]);

  const activeId =
    activeProductId === productId && activeMediaId ? activeMediaId : primary.id;
  const active = gallery.find((i) => i.id === activeId) ?? primary;

  return (
    <div>
      <div className="relative border border-ink/15 p-3">
        <p className="absolute -top-3 left-3 z-10 bg-oxblood px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
          {tag}
        </p>
        <div className="relative aspect-4/5 overflow-hidden bg-line">
          {active.mediaType === "video" ? (
            <video
              key={active.id}
              src={active.url}
              controls
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : (
            <Image
              src={active.url}
              alt={active.alt || `${name} — ${category} at ${SITE.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          )}
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {gallery.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => select(productId, item.id)}
              aria-label={`View ${item.alt || name}`}
              aria-current={item.id === activeId}
              className={`relative size-16 overflow-hidden border bg-line transition-colors ${
                item.id === activeId
                  ? "border-oxblood"
                  : "border-ink/15 hover:border-ink"
              }`}
            >
              {item.mediaType === "video" ? (
                <span className="grid size-full place-items-center bg-ink/80 text-paper">
                  <Play className="size-5" fill="currentColor" />
                </span>
              ) : (
                <Image
                  src={item.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
