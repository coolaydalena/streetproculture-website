"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProductImage } from "@/lib/products";

/**
 * Full-screen media viewer shared by the storefront gallery and the admin
 * image manager. Render it once per surface and drive it with `index`:
 * a number opens the overlay on that item, `null` closes it.
 */
export function MediaLightbox({
  items,
  index,
  onClose,
  onIndexChange,
  altFallback = "",
}: {
  items: ProductImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  altFallback?: string;
}) {
  const isOpen =
    index !== null && index >= 0 && index < items.length;
  const count = items.length;
  const canPage = isOpen && count > 1 && !!onIndexChange;

  const step = useCallback(
    (dir: -1 | 1) => {
      if (!canPage || index === null) return;
      onIndexChange!((index + dir + count) % count);
    },
    [canPage, index, count, onIndexChange],
  );

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, step]);

  if (typeof document === "undefined" || !isOpen) return null;

  const active = items[index];

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      <div
        className="absolute inset-0 bg-coal/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 p-2 text-paper/70 transition-colors hover:text-paper"
      >
        <X className="size-6" />
      </button>

      {canPage && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="absolute left-2 z-10 p-2 text-paper/70 transition-colors hover:text-paper sm:left-4"
          >
            <ChevronLeft className="size-8" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="absolute right-2 z-10 p-2 text-paper/70 transition-colors hover:text-paper sm:right-4"
          >
            <ChevronRight className="size-8" />
          </button>
        </>
      )}

      <motion.div
        key={active.id}
        className="relative z-0 flex max-h-[90vh] max-w-[92vw] items-center justify-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
      >
        {active.mediaType === "video" ? (
          <video
            src={active.url}
            controls
            autoPlay
            playsInline
            className="max-h-[90vh] max-w-[92vw]"
          />
        ) : (
          <Image
            src={active.url}
            alt={active.alt || altFallback}
            width={1600}
            height={2000}
            sizes="92vw"
            className="h-auto max-h-[90vh] w-auto object-contain"
          />
        )}
      </motion.div>

      {count > 1 && (
        <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/70">
          {index + 1} / {count}
        </p>
      )}
    </motion.div>,
    document.body,
  );
}
