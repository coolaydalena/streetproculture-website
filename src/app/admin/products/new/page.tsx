import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="u-label text-ink-soft hover:text-oxblood"
      >
        ← Products
      </Link>
      <h1 className="u-display mt-3 text-4xl">New product</h1>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
