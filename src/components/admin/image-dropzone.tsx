"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addProductMedia } from "@/lib/actions/products";
import type { ProductMediaType } from "@/lib/products";
import { useToast } from "@/components/ui/toast";

const IMAGE_ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const VIDEO_ACCEPT = ["video/mp4", "video/webm"];
const IMAGE_MAX = 5 * 1024 * 1024; // 5 MB
const VIDEO_MAX = 50 * 1024 * 1024; // 50 MB

function kindOf(type: string): ProductMediaType | null {
  if (IMAGE_ACCEPT.includes(type)) return "image";
  if (VIDEO_ACCEPT.includes(type)) return "video";
  return null;
}

export function ImageDropzone({ productId }: { productId: string }) {
  const { push } = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);

  async function upload(files: FileList | File[]) {
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const kind = kindOf(file.type);
      if (!kind) {
        push(`${file.name}: unsupported type`, "error");
        continue;
      }
      const max = kind === "video" ? VIDEO_MAX : IMAGE_MAX;
      if (file.size > max) {
        push(`${file.name}: over ${kind === "video" ? "50 MB" : "5 MB"}`, "error");
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;
      const bucket = kind === "video" ? "product-videos" : "product-images";

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        push(`${file.name}: ${uploadError.message}`, "error");
        continue;
      }

      const res = await addProductMedia({
        productId,
        storagePath: path,
        mediaType: kind,
      });
      if (!res.ok) {
        push(res.error ?? "Could not save media", "error");
        continue;
      }
      push(kind === "video" ? "Video added" : "Image added", "success");
    }
    router.refresh();
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) {
          startTransition(() => upload(e.dataTransfer.files));
        }
      }}
      className={`flex flex-col items-center justify-center gap-2 border border-dashed p-8 text-center ${
        dragging ? "border-oxblood bg-oxblood/5" : "border-line"
      }`}
    >
      <UploadCloud className="size-6 text-ink-soft" />
      <p className="text-sm text-ink-soft">
        Drag images or videos here, or{" "}
        <button
          type="button"
          className="text-oxblood underline underline-offset-2"
          onClick={() => inputRef.current?.click()}
        >
          browse
        </button>
      </p>
      <p className="text-xs text-ink-soft">
        PNG, JPG, WebP, AVIF up to 5 MB · MP4 or WebM up to 50 MB
      </p>
      {pending && <p className="u-label text-oxblood">Uploading…</p>}
      <input
        ref={inputRef}
        type="file"
        accept={[...IMAGE_ACCEPT, ...VIDEO_ACCEPT].join(",")}
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) {
            startTransition(() => upload(e.target.files!));
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
