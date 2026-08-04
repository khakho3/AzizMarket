import type { Metadata } from "next";
import { ProductDetailsPageContent } from "@/components/marketplace/product-details-page-content";
import { products } from "@/data/products";
import { getProductById } from "@/services/product-service";

interface ProductPageProps { params: Promise<{ id: string }> }

export function generateStaticParams() { return products.map((product) => ({ id: product.id })); }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById((await params).id);
  return product ? { title: product.name, description: product.description } : { title: "Product" };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  return <ProductDetailsPageContent id={(await params).id} />;
}
