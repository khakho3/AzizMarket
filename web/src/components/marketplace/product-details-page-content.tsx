"use client";

import Link from "next/link";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductDetailsView } from "@/components/marketplace/product-details-view";
import { ProductGrid } from "@/components/marketplace/product-grid";
import { useCategories } from "@/context/category-context";
import { useProducts } from "@/context/product-context";
import { useAdmin } from "@/context/admin-context";

export function ProductDetailsPageContent({ id }: { id: string }) {
  const { publicProducts } = useProducts();
  const { categories } = useCategories();
  const { sellerRecords } = useAdmin();
  const product = publicProducts.find((candidate) => {
    const categoryIsActive = categories.some((category) => category.id === candidate.categoryId && category.isActive);
    const subcategoryIsActive = !candidate.subcategoryId || categories.some((category) => category.id === candidate.subcategoryId && category.isActive);
    const sellerIsActive = sellerRecords.some((seller) => seller.sellerId === candidate.seller.id && !["Suspended", "Banned", "Rejected"].includes(seller.status));
    return (candidate.id === id || candidate.slug === id) && categoryIsActive && subcategoryIsActive && sellerIsActive;
  });

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-3xl font-black text-slate-950">Product not found</h1>
        <p className="mt-3 text-slate-500">This product is unavailable or has been deactivated.</p>
        <Link href="/products" className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Browse products</Link>
      </Container>
    );
  }

  const category = categories.find((candidate) => candidate.id === product.categoryId);
  const related = publicProducts.filter((candidate) => candidate.id !== product.id && candidate.categoryId === product.categoryId && sellerRecords.some((seller) => seller.sellerId === candidate.seller.id && !["Suspended", "Banned", "Rejected"].includes(seller.status))).slice(0, 4);

  return (
    <>
      <Container className="py-5">
        <nav className="flex items-center gap-2 overflow-hidden text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="shrink-0 hover:text-emerald-700">Home</Link><span>/</span>
          <Link href="/products" className="shrink-0 hover:text-emerald-700">Products</Link><span>/</span>
          {category ? <><Link href={`/categories/${category.slug}`} className="shrink-0 hover:text-emerald-700">{category.name}</Link><span>/</span></> : null}
          <span className="truncate font-semibold text-slate-700">{product.name}</span>
        </nav>
      </Container>
      <ProductDetailsView product={product} />
      {related.length ? (
        <section className="bg-white py-14 sm:py-20">
          <Container>
            <SectionHeading title="Related products" description={`More products in ${category?.name ?? "this category"}.`} linkHref={category ? `/categories/${category.slug}` : "/products"} linkLabel="View category" />
            <ProductGrid products={related} />
          </Container>
        </section>
      ) : null}
    </>
  );
}
