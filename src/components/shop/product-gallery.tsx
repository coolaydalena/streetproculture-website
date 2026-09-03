"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/products";
import { SITE } from "@/lib/site";

export function ProductGallery({
  images,
  fallback,
  name,
  category,
  tag,
}: {
  images: ProductImage[];
  fallback: string;
  name: string;
  category: string;
  tag: string;
}) {
  const gallery =
    images.length > 0
      ? images
      : [{ id: "fallback", url: fallback, alt: name, isPrimary: true, sortOrder: 0 }];

  const [activeId, setActiveId] = useState(
    (gallery.find((i) => i.isPrimary) ?? gallery[0]).id,
  );
  const active = gallery.find((i) => i.id === activeId) ?? gallery[0];

  return (
    <div>
      <div className="relative border border-ink/15 p-3">
        <p className="absolute -top-3 left-3 z-10 bg-oxblood px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
          {tag}
        </p>
        <div className="relative aspect-4/5 overflow-hidden bg-line">
          <Image
            src={active.url}
            alt={active.alt || `${name} — ${category} at ${SITE.name}`}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {gallery.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveId(img.id)}
              aria-label={`View ${img.alt || name}`}
              aria-current={img.id === activeId}
              className={`relative size-16 overflow-hidden border bg-line transition-colors ${
                img.id === activeId ? "border-oxblood" : "border-ink/15 hover:border-ink"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
