import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { CategoriesPageContent } from "@/components/marketplace/categories-page-content";

export const metadata: Metadata = { title: "Categories", description: "Browse all product categories on AzizMarket." };

export default function CategoriesPage() {
  return (
    <>
      <PageHeader eyebrow="Explore" title="Shop every category" description="Discover products for your home, wardrobe, business and everyday life from local sellers around Ghana." />
      <CategoriesPageContent />
    </>
  );
}
