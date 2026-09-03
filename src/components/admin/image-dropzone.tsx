"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addProductImage } from "@/lib/actions/products";
import { useToast } from "@/components/ui/toast";

const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_BYTES = 5 * 1024 * 1024;

export function ImageDropzone({ productId }: { productId: string }) {
  const { push } = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);

  async function upload(files: FileList | File[]) {
    const supabase = createClient();
    for (const file of Array.from(files)) {
      if (!ACCEPT.includes(file.type)) {
        push(`${file.name}: unsupported type`, "error");
        continue;
      }
      if (file.size > MAX_BYTES) {
        push(`${file.name}: over 5 MB`, "error");
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        push(`${file.name}: ${uploadError.message}`, "error");
        continue;
      }

      const res = await addProductImage({ productId, storagePath: path });
      if (!res.ok) {
        push(res.error ?? "Could not save image", "error");
        continue;
      }
      push("Image added", "success");
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
        Drag images here, or{" "}
        <button
          type="button"
          className="text-oxblood underline underline-offset-2"
          onClick={() => inputRef.current?.click()}
        >
          browse
        </button>
      </p>
      <p className="text-xs text-ink-soft">PNG, JPG, WebP or AVIF · up to 5 MB</p>
      {pending && <p className="u-label text-oxblood">Uploading…</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(",")}
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
