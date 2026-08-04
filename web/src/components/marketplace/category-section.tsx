"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { useCategories } from "@/context/category-context";
import { useProducts } from "@/context/product-context";
import { useAdmin } from "@/context/admin-context";

const accents = ["bg-sky-50", "bg-indigo-50", "bg-cyan-50", "bg-rose-50", "bg-amber-50", "bg-orange-50"];

export function CategorySection() {
  const { activeCategories } = useCategories();
  const { publicProducts } = useProducts();
  const { sellerRecords } = useAdmin();
  const allowedSellerIds = new Set(sellerRecords.filter((seller) => !["Suspended", "Banned", "Rejected"].includes(seller.status)).map((seller) => seller.sellerId));
  const mainCategories = activeCategories.filter((category) => !category.parentCategoryId).slice(0, 6);

  return (
    <section id="categories" className="scroll-mt-28 bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Explore the marketplace" title="Shop by category" description="From everyday essentials to unique locally made finds, start with what matters to you." linkHref="/categories" linkLabel="All categories" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {mainCategories.map((category, index) => {
            const count = publicProducts.filter((product) => allowedSellerIds.has(product.seller.id) && product.categoryId === category.id).length;
            return (
              <Link key={category.id} href={`/categories/${category.slug}`} className={`group overflow-hidden rounded-2xl border border-transparent transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-900/5 ${accents[index % accents.length]}`}>
                <div className="relative h-28 overflow-hidden bg-white/60 sm:h-32">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized={category.image.startsWith("data:")}
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 16vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent" />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">{category.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{count ? `${count} ${count === 1 ? "product" : "products"}` : "No products yet"}</p>
                  <ArrowRightIcon className="mt-4 size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
