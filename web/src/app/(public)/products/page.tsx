import type { Metadata } from "next";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { ProductCatalogue } from "@/components/marketplace/product-catalogue";
import { getCategoryBySlug } from "@/data/categories";

export const metadata: Metadata = {
  title: "Browse Products",
  description: "Search and filter products from trusted sellers across Ghana.",
};

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q = "", category } = await searchParams;
  const selectedCategory = category ? getCategoryBySlug(category) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Buyer marketplace"
        title="Browse Products"
        description="Compare products, payment options and trusted sellers from locations across Ghana."
      />
      <section className="bg-slate-50/60 py-10 sm:py-14">
        <Container>
          <ProductCatalogue
            initialQuery={q}
            initialCategoryId={selectedCategory?.id}
          />
        </Container>
      </section>
    </>
  );
}
