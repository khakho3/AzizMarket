"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
  StoreIcon,
} from "@/components/common/icons";
import {
  ProductFilterPanel,
  type CatalogueFilters,
} from "@/components/marketplace/product-filter-panel";
import { ProductGrid } from "@/components/marketplace/product-grid";
import { ProductGridSkeleton } from "@/components/marketplace/product-grid-skeleton";
import { useCategories } from "@/context/category-context";
import { useProducts } from "@/context/product-context";
import { useAdmin } from "@/context/admin-context";

type SortOption = "relevant" | "newest" | "price-low" | "price-high" | "rating";

const pageSize = 8;

interface ProductCatalogueProps {
  initialQuery?: string;
  initialCategoryId?: string;
  initialSubcategoryId?: string;
  hideCategoryFilter?: boolean;
}

export function ProductCatalogue({
  initialQuery = "",
  initialCategoryId,
  initialSubcategoryId,
  hideCategoryFilter = false,
}: ProductCatalogueProps) {
  const { publicProducts } = useProducts();
  const { categories } = useCategories();
  const { sellerRecords } = useAdmin();
  const products = useMemo(() => {
    const activeIds = new Set(categories.filter((category) => category.isActive).map((category) => category.id));
    const allowedSellerIds = new Set(sellerRecords.filter((seller) => !["Suspended", "Banned", "Rejected"].includes(seller.status)).map((seller) => seller.sellerId));
    return publicProducts.filter((product) => allowedSellerIds.has(product.seller.id) && activeIds.has(product.categoryId) && (!product.subcategoryId || activeIds.has(product.subcategoryId)));
  }, [categories, publicProducts, sellerRecords]);
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const initialFilters: CatalogueFilters = {
    search: initialQuery,
    categoryIds: initialCategoryId ? [initialCategoryId] : [],
    subcategoryIds: initialSubcategoryId ? [initialSubcategoryId] : [],
    minPrice: "",
    maxPrice: "",
    location: "",
    rating: 0,
    paymentTypes: [],
    availability: "all",
  };
  const [filters, setFilters] = useState<CatalogueFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>("relevant");
  const [page, setPage] = useState(1);
  const deferredFilters = useDeferredValue(filters);
  const isFiltering = deferredFilters !== filters;

  const filteredProducts = useMemo(() => {
    const query = deferredFilters.search.trim().toLowerCase();
    const minimumPrice = Number(deferredFilters.minPrice) || 0;
    const maximumPrice = Number(deferredFilters.maxPrice) || Number.POSITIVE_INFINITY;

    const filtered = products.filter((product) => {
      const matchesSearch =
        !query ||
        [
          product.name,
          product.description,
          categoryNames.get(product.categoryId) ?? "",
          product.seller.storeName,
          product.location,
        ].some((value) => value.toLowerCase().includes(query));
      const matchesCategory =
        deferredFilters.categoryIds.length === 0 ||
        deferredFilters.categoryIds.includes(product.categoryId);
      const matchesSubcategory =
        deferredFilters.subcategoryIds.length === 0 ||
        Boolean(product.subcategoryId && deferredFilters.subcategoryIds.includes(product.subcategoryId));
      const matchesPrice = product.price >= minimumPrice && product.price <= maximumPrice;
      const matchesLocation =
        !deferredFilters.location || product.location === deferredFilters.location;
      const matchesRating = product.rating >= deferredFilters.rating;
      const matchesPayment =
        deferredFilters.paymentTypes.length === 0 ||
        deferredFilters.paymentTypes.some((paymentType) =>
          product.paymentTypes.includes(paymentType),
        );
      const matchesAvailability =
        deferredFilters.availability === "all" ||
        (deferredFilters.availability === "in-stock" && product.stock > 0) ||
        (deferredFilters.availability === "out-of-stock" && product.stock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesPrice &&
        matchesLocation &&
        matchesRating &&
        matchesPayment &&
        matchesAvailability
      );
    });

    return filtered.sort((first, second) => {
      switch (sort) {
        case "newest":
          return Date.parse(second.createdAt) - Date.parse(first.createdAt);
        case "price-low":
          return first.price - second.price;
        case "price-high":
          return second.price - first.price;
        case "rating":
          return second.rating - first.rating || second.reviewCount - first.reviewCount;
        default:
          return Number(second.featured) - Number(first.featured) || second.rating - first.rating;
      }
    });
  }, [categoryNames, deferredFilters, products, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const activeFilterCount =
    filters.categoryIds.length +
    filters.subcategoryIds.length +
    filters.paymentTypes.length +
    Number(Boolean(filters.minPrice)) +
    Number(Boolean(filters.maxPrice)) +
    Number(Boolean(filters.location)) +
    Number(filters.rating > 0) +
    Number(filters.availability !== "all");

  function updateFilters(nextFilters: CatalogueFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function clearFilters() {
    setFilters({ ...initialFilters, search: "" });
    setPage(1);
  }

  return (
    <div>
      <div className="relative mb-6">
        <label htmlFor="catalogue-search" className="sr-only">Search products</label>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          id="catalogue-search"
          type="search"
          value={filters.search}
          onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
          placeholder="Search products, stores or locations"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 sm:text-base"
        />
      </div>

      <details className="group mb-6 rounded-2xl border border-slate-200 bg-white lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <FilterIcon className="size-5 text-emerald-700" /> Filters
            {activeFilterCount > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-emerald-700 text-[10px] text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </span>
          <span className="text-xs font-bold text-slate-500 group-open:hidden">Open</span>
          <span className="hidden text-xs font-bold text-slate-500 group-open:block">Close</span>
        </summary>
        <div className="border-t border-slate-200 p-5">
          <ProductFilterPanel
            filters={filters}
            categories={categories}
            idPrefix="mobile"
            hideCategoryFilter={hideCategoryFilter}
            onChange={updateFilters}
            onClear={clearFilters}
          />
        </div>
      </details>

      <div className="grid items-start gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="sticky top-28 hidden rounded-2xl border border-slate-200 bg-white p-5 lg:block">
          <ProductFilterPanel
            filters={filters}
            categories={categories}
            idPrefix="desktop"
            hideCategoryFilter={hideCategoryFilter}
            onChange={updateFilters}
            onClear={clearFilters}
          />
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {visibleProducts.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filteredProducts.length)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="catalogue-sort" className="shrink-0 text-sm font-bold text-slate-600">Sort by</label>
              <select
                id="catalogue-sort"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortOption);
                  setPage(1);
                }}
                className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {isFiltering ? (
            <ProductGridSkeleton />
          ) : visibleProducts.length ? (
            <ProductGrid products={visibleProducts} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                <StoreIcon className="size-7" />
              </span>
              <h2 className="mt-5 text-xl font-black text-slate-900">No products match your filters</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try widening your price range, choosing another location or clearing the filters to see all products.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-800"
              >
                Clear all filters
              </button>
            </div>
          )}

          {filteredProducts.length > pageSize ? (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Product pagination">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={safePage === pageNumber ? "page" : undefined}
                  className={`size-10 rounded-xl text-sm font-extrabold transition ${safePage === pageNumber ? "bg-emerald-700 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300"}`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
