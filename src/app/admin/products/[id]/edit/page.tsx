import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductForAdmin } from "@/lib/products-admin";
import { ProductForm } from "@/components/admin/product-form";
import { ImageManager } from "@/components/admin/image-manager";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductForAdmin(id);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="u-label text-ink-soft hover:text-oxblood"
      >
        ← Products
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="u-display text-4xl">{product.name}</h1>
        <Link
          href={`/shop/${product.slug}`}
          target="_blank"
          className="u-label text-ink-soft hover:text-oxblood"
        >
          View in shop ↗
        </Link>
      </div>

      <div className="mt-8">
        <ProductForm product={product} />
      </div>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="u-display text-2xl">Images</h2>
        <p className="mt-2 text-sm text-ink-soft">
          The primary image is used on cards, the home page and social previews.
        </p>
        <div className="mt-5">
          <ImageManager productId={product.id} images={product.images} />
        </div>
      </section>
    </div>
  );
}
