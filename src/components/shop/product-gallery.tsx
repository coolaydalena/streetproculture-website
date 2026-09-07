"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import type { ProductImage } from "@/lib/products";
import { SITE } from "@/lib/site";
import { usePdpStore } from "@/lib/store/pdp-store";
import { MediaLightbox } from "@/components/ui/media-lightbox";

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
  const activeIndex = Math.max(
    0,
    gallery.findIndex((i) => i.id === activeId),
  );
  const active = gallery[activeIndex] ?? primary;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-sm lg:max-w-md">
      <div className="relative border border-ink/15 p-3">
        <p className="absolute -top-3 left-3 z-10 bg-oxblood px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
          {tag}
        </p>
        <button
          type="button"
          onClick={() => setLightboxIndex(activeIndex)}
          aria-label={
            active.mediaType === "video"
              ? "Play video"
              : "View full screen"
          }
          className={`group relative block aspect-4/5 w-full overflow-hidden bg-line ${
            active.mediaType === "video" ? "cursor-pointer" : "cursor-zoom-in"
          }`}
        >
          {active.mediaType === "video" ? (
            <>
              <video
                key={active.id}
                src={`${active.url}#t=0.1`}
                muted
                playsInline
                preload="metadata"
                tabIndex={-1}
                className="pointer-events-none size-full object-cover"
              />
              <span className="absolute inset-0 grid place-items-center bg-coal/30 text-paper transition-colors group-hover:bg-coal/40">
                <Play className="size-10 translate-x-0.5" fill="currentColor" />
              </span>
            </>
          ) : (
            <Image
              src={active.url}
              alt={active.alt || `${name} — ${category} at ${SITE.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          )}
        </button>
      </div>

      <MediaLightbox
        items={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(i) => {
          setLightboxIndex(i);
          select(productId, gallery[i].id);
        }}
        altFallback={`${name} — ${category} at ${SITE.name}`}
      />

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
                <>
                  <video
                    src={`${item.url}#t=0.1`}
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                    className="pointer-events-none size-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-coal/30 text-paper">
                    <Play className="size-5 translate-x-px" fill="currentColor" />
                  </span>
                </>
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
