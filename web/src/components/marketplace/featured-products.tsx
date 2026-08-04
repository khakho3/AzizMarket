"use client";

import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/marketplace/product-grid";
import { useProducts } from "@/context/product-context";
import { useCategories } from "@/context/category-context";
import { useAdmin } from "@/context/admin-context";

export function FeaturedProducts() {
  const { publicProducts } = useProducts();
  const { activeCategories } = useCategories();
  const { sellerRecords } = useAdmin();
  const activeIds = new Set(activeCategories.map((category) => category.id));
  const allowedSellerIds = new Set(sellerRecords.filter((seller) => !["Suspended", "Banned", "Rejected"].includes(seller.status)).map((seller) => seller.sellerId));
  const featuredProducts = publicProducts.filter((product) => allowedSellerIds.has(product.seller.id) && product.featured && activeIds.has(product.categoryId) && (!product.subcategoryId || activeIds.has(product.subcategoryId))).slice(0, 8);

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Handpicked for you"
          title="Featured products"
          description="Popular picks from highly rated stores around the country."
          linkHref="/products"
          linkLabel="Browse all products"
        />
        <ProductGrid products={featuredProducts} />
      </Container>
    </section>
  );
}
