import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/marketplace/category-page-content";
import { categories, getCategoryBySlug } from "@/data/categories";

interface CategoryPageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() { return categories.map((category) => ({ slug: category.slug })); }

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug((await params).slug);
  return category ? { title: category.name, description: category.description } : { title: "Category" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryPageContent slug={(await params).slug} />;
}
