"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validation/product";
import { PRODUCT_CATEGORIES } from "@/lib/products";
import type { AdminProduct } from "@/lib/products-admin";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { slugify } from "@/lib/slugify";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

function defaults(product?: AdminProduct): ProductFormValues {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? "caps",
    tag: product?.tag ?? "",
    brand: product?.brand ?? "",
    price: product?.price ?? 0,
    blurb: product?.blurb ?? "",
    specs: product?.specs ?? [],
    trackInventory: product?.trackInventory ?? false,
    stockQuantity: product?.stockQuantity ?? 0,
    isHighlighted: product?.isHighlighted ?? false,
    isPublished: product?.isPublished ?? false,
    isMock: product?.isMock ?? false,
  };
}

export function ProductForm({ product }: { product?: AdminProduct }) {
  const mode = product ? "edit" : "create";
  const { push } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [slugEdited, setSlugEdited] = useState(mode === "edit");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaults(product),
  });
  const { register, control, handleSubmit, setValue, setError, formState } = form;
  const errors = formState.errors;

  const specs = useFieldArray({ control, name: "specs" });
  const trackInventory = useWatch({ control, name: "trackInventory" });
  const nameValue = useWatch({ control, name: "name" });

  // Auto-fill the slug from the name until the user edits it directly.
  useEffect(() => {
    if (!slugEdited && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, slugEdited, setValue]);

  const onSubmit = handleSubmit((values) => {
    const payload: ProductFormValues = {
      ...values,
      stockQuantity: values.trackInventory ? values.stockQuantity : null,
      specs: values.specs.filter((s) => s.label.trim() && s.value.trim()),
    };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProduct({ ok: false }, payload)
          : await updateProduct({ ok: false }, { ...payload, id: product!.id });

      if (result.ok) {
        if (mode === "create" && result.productId) {
          push("Draft created — add images below", "success");
          router.push(`/admin/products/${result.productId}/edit`);
        } else {
          push("Product saved", "success");
          router.refresh();
        }
        return;
      }
      if (result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          setError(key as keyof ProductFormValues, { message });
        }
      }
      if (result.error) push(result.error, "error");
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" {...register("name")} />
        </Field>

        <Field
          label="Slug"
          htmlFor="slug"
          error={errors.slug?.message}
          hint="Used in the product URL: /shop/<slug>"
        >
          <Input
            id="slug"
            {...register("slug", { onChange: () => setSlugEdited(true) })}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Category"
            htmlFor="category"
            error={errors.category?.message}
          >
            <Select id="category" {...register("category")}>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Tag"
            htmlFor="tag"
            error={errors.tag?.message}
            hint='Corner label, e.g. "CAP — 01"'
          >
            <Input id="tag" {...register("tag")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Brand"
            htmlFor="brand"
            error={errors.brand?.message}
            hint="Optional — free text"
          >
            <Input id="brand" {...register("brand")} />
          </Field>
          <Field
            label="Price (₱)"
            htmlFor="price"
            error={errors.price?.message}
            hint="Whole pesos, no decimals"
          >
            <Input
              id="price"
              type="number"
              min={0}
              step={1}
              {...register("price", { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field label="Blurb" htmlFor="blurb" error={errors.blurb?.message}>
          <Textarea id="blurb" rows={3} {...register("blurb")} />
        </Field>

        {/* Specs */}
        <div>
          <div className="flex items-center justify-between">
            <span className="u-label text-ink-soft">Technical breakdown</span>
            <button
              type="button"
              onClick={() => specs.append({ label: "", value: "" })}
              className="u-label inline-flex items-center gap-1 text-oxblood"
            >
              <Plus className="size-3.5" /> Add row
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {specs.fields.length === 0 && (
              <p className="text-xs text-ink-soft">No spec rows.</p>
            )}
            {specs.fields.map((row, i) => (
              <div key={row.id} className="flex gap-2">
                <input
                  placeholder="Label"
                  className="w-1/3 border border-line bg-paper-card px-3 py-2 text-sm outline-none focus:border-oxblood"
                  {...register(`specs.${i}.label` as const)}
                />
                <input
                  placeholder="Value"
                  className="flex-1 border border-line bg-paper-card px-3 py-2 text-sm outline-none focus:border-oxblood"
                  {...register(`specs.${i}.value` as const)}
                />
                <button
                  type="button"
                  onClick={() => specs.remove(i)}
                  className="px-2 text-ink-soft hover:text-oxblood"
                  aria-label="Remove row"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-5 lg:border-l lg:border-line lg:pl-8">
        <div className="space-y-3">
          <Checkbox
            label="Published"
            description="Visible in the shop and sitemap"
            {...register("isPublished")}
          />
          <Checkbox
            label="Show on home page"
            description="Featured in the home 'Shop' section"
            {...register("isHighlighted")}
          />
          <Checkbox
            label="Preview listing"
            description="Shows the 'final photography to follow' note"
            {...register("isMock")}
          />
        </div>

        <div className="border-t border-line pt-5">
          <Checkbox
            label="Track inventory"
            description="Off = unlimited stock"
            {...register("trackInventory")}
          />
          {trackInventory && (
            <Field
              label="Stock quantity"
              htmlFor="stockQuantity"
              error={errors.stockQuantity?.message}
            >
              <Input
                id="stockQuantity"
                type="number"
                min={0}
                step={1}
                {...register("stockQuantity", { valueAsNumber: true })}
              />
            </Field>
          )}
        </div>

        <div className="border-t border-line pt-5">
          <Button type="submit" disabled={pending} className="w-full">
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create draft"
                : "Save changes"}
          </Button>
          {mode === "create" && (
            <p className="mt-2 text-xs text-ink-soft">
              Save the draft first, then add images.
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}
