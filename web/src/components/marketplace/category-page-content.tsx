"use client";

import Link from "next/link";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { ProductCatalogue } from "@/components/marketplace/product-catalogue";
import { useCategories } from "@/context/category-context";

export function CategoryPageContent({ slug }: { slug: string }) {
  const { categories } = useCategories();
  const selected = categories.find((category) => category.slug === slug && category.isActive);

  if (!selected) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-3xl font-black text-slate-950">Category not found</h1>
        <p className="mt-3 text-slate-500">This category is unavailable or has been deactivated.</p>
        <Link href="/categories" className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Browse categories</Link>
      </Container>
    );
  }

  const mainCategoryId = selected.parentCategoryId ?? selected.id;
  const subcategories = categories.filter((category) => category.parentCategoryId === mainCategoryId && category.isActive);

  return (
    <>
      <PageHeader eyebrow={selected.parentCategoryId ? "Product subcategory" : "Product category"} title={selected.name} description={selected.description} />
      {subcategories.length && !selected.parentCategoryId ? (
        <div className="border-b border-slate-200 bg-white">
          <Container className="flex gap-2 overflow-x-auto py-4">
            {subcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/categories/${subcategory.slug}`} className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700">{subcategory.name}</Link>
            ))}
          </Container>
        </div>
      ) : null}
      <section className="bg-slate-50/60 py-10 sm:py-14">
        <Container>
          <ProductCatalogue key={selected.id} initialCategoryId={mainCategoryId} initialSubcategoryId={selected.parentCategoryId ? selected.id : undefined} hideCategoryFilter />
        </Container>
      </section>
    </>
  );
}
