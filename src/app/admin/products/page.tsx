import Link from "next/link";
import { listProductsForAdmin } from "@/lib/products-admin";
import { ProductList } from "@/components/admin/product-list";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProductsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="u-display text-4xl">Products</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {products.length} {products.length === 1 ? "product" : "products"} ·{" "}
            {products.filter((p) => p.isPublished).length} live
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="u-label bg-oxblood px-5 py-3 text-paper transition-colors hover:bg-oxblood-deep"
        >
          New product
        </Link>
      </div>

      <div className="mt-8">
        {products.length === 0 ? (
          <p className="text-ink-soft">No products yet.</p>
        ) : (
          <ProductList products={products} />
        )}
      </div>
    </div>
  );
}
