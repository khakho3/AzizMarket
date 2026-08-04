"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { categories as initialCategories } from "@/data/categories";
import type { Category } from "@/types";

const storageKey = "azizmarket-categories";
const changeEvent = "azizmarket-categories-change";
const initialSnapshot = JSON.stringify(initialCategories);

interface CategoryContextValue {
  categories: Category[];
  activeCategories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryActive: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(changeEvent, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(storageKey) ?? initialSnapshot;
}

function parseCategories(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? (value as Category[]) : initialCategories;
  } catch {
    return initialCategories;
  }
}

function save(categories: Category[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(categories));
  window.dispatchEvent(new Event(changeEvent));
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => initialSnapshot);
  const categories = useMemo(() => parseCategories(snapshot), [snapshot]);
  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );
  const addCategory = useCallback((category: Category) => save([...categories, category]), [categories]);
  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) =>
      save(categories.map((category) => category.id === id ? { ...category, ...updates, id } : category)),
    [categories],
  );
  const deleteCategory = useCallback(
    (id: string) => save(categories.filter((category) => category.id !== id && category.parentCategoryId !== id)),
    [categories],
  );
  const toggleCategoryActive = useCallback(
    (id: string) => save(categories.map((category) => category.id === id ? { ...category, isActive: !category.isActive } : category)),
    [categories],
  );

  const value = useMemo<CategoryContextValue>(() => ({
    categories,
    activeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
  }), [categories, activeCategories, addCategory, updateCategory, deleteCategory, toggleCategoryActive]);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategories must be used within CategoryProvider");
  return context;
}
