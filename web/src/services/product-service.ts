import { products } from "@/data/products";
import { getCategoryById, getCategoryBySlug } from "@/data/categories";
import type { Product } from "@/types";

interface ProductFilters {
  query?: string;
  category?: string;
}

export function getProducts(filters: ProductFilters = {}): Product[] {
  const query = filters.query?.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      !filters.category || product.categoryId === getCategoryBySlug(filters.category)?.id;
    const matchesQuery =
      !query ||
      [
        product.name,
        product.description,
        getCategoryById(product.categoryId)?.name ?? "",
        product.seller.storeName,
        product.location,
      ].some((value) => value.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isActive && product.featured).slice(0, 8);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id || product.slug === id);
}

export function getProductsByCategory(slug: string): Product[] {
  const category = getCategoryBySlug(slug);
  return category ? products.filter((product) => product.isActive && product.categoryId === category.id) : [];
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.isActive && candidate.categoryId === product.categoryId,
    )
    .slice(0, limit);
}
