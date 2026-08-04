"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function useMarketplaceSearch(initialQuery = "") {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    router.push(search ? `/products?q=${encodeURIComponent(search)}` : "/products");
  }

  return { query, setQuery, submitSearch };
}
