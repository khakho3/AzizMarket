import type { Product, ProductStatus } from "@/types";

export function getProductStatus(product: Product): ProductStatus {
  if (product.stock <= 0) return "Out of Stock";
  if (product.status) return product.status;
  return product.isActive ? "Active" : "Inactive";
}

export function isPublicProduct(product: Product): boolean {
  return getProductStatus(product) === "Active" && product.isActive && product.stock > 0;
}
