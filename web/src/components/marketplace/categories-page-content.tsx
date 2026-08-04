"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";
import { useCategories } from "@/context/category-context";
import { useProducts } from "@/context/product-context";
import { useAdmin } from "@/context/admin-context";

const accents = ["bg-sky-50", "bg-indigo-50", "bg-cyan-50", "bg-rose-50", "bg-amber-50", "bg-orange-50", "bg-violet-50", "bg-emerald-50", "bg-slate-100", "bg-teal-50"];

export function CategoriesPageContent() {
  const { activeCategories } = useCategories();
  const { publicProducts } = useProducts();
  const { sellerRecords } = useAdmin();
  const allowedSellerIds = new Set(sellerRecords.filter((seller) => !["Suspended", "Banned", "Rejected"].includes(seller.status)).map((seller) => seller.sellerId));
  const mainCategories = activeCategories.filter((category) => !category.parentCategoryId);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mainCategories.map((category, index) => {
            const count = publicProducts.filter((product) => allowedSellerIds.has(product.seller.id) && product.categoryId === category.id).length;
            return (
              <Link key={category.id} href={`/categories/${category.slug}`} className={`group flex min-h-80 flex-col overflow-hidden rounded-3xl border border-transparent transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-900/5 ${accents[index % accents.length]}`}>
                <div className="relative h-40 overflow-hidden bg-white/60 sm:h-44">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized={category.image.startsWith("data:")}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h2 className="text-xl font-black text-slate-950">{category.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                  <span className="mt-auto flex items-center justify-between pt-5 text-sm font-bold text-emerald-800">
                    {count ? `${count} ${count === 1 ? "product" : "products"}` : "No products yet"}
                    <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
