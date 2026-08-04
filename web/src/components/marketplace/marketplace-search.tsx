"use client";

import { SearchIcon } from "@/components/common/icons";
import { useMarketplaceSearch } from "@/hooks/use-marketplace-search";

interface MarketplaceSearchProps {
  initialQuery?: string;
  compact?: boolean;
}

export function MarketplaceSearch({
  initialQuery = "",
  compact = false,
}: MarketplaceSearchProps) {
  const { query, setQuery, submitSearch } = useMarketplaceSearch(initialQuery);

  return (
    <form
      onSubmit={submitSearch}
      className={`flex w-full items-center bg-white shadow-xl shadow-emerald-950/15 ${
        compact ? "rounded-xl border border-slate-200 p-1.5" : "rounded-2xl p-2"
      }`}
      role="search"
    >
      <SearchIcon className="ml-2 size-5 shrink-0 text-slate-400 sm:ml-3" />
      <label htmlFor={compact ? "catalog-search" : "marketplace-search"} className="sr-only">
        Search products, stores and categories
      </label>
      <input
        id={compact ? "catalog-search" : "marketplace-search"}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What are you looking for?"
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 sm:px-7"
      >
        Search
      </button>
    </form>
  );
}
