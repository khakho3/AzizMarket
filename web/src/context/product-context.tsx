"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Toast, type ToastMessage } from "@/components/common/toast";
import { products as initialProducts } from "@/data/products";
import type { Product } from "@/types";
import { isPublicProduct } from "@/utils/product-status";

const storageKey = "azizmarket-products";
const changeEvent = "azizmarket-products-change";
const initialSnapshot = JSON.stringify(initialProducts);

interface ProductContextValue {
  products: Product[];
  publicProducts: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  reduceStock: (items: Array<{ productId: string; quantity: number }>) => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

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

function parseProducts(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? (value as Product[]) : initialProducts;
  } catch {
    return initialProducts;
  }
}

function save(products: Product[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(products));
  window.dispatchEvent(new Event(changeEvent));
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => initialSnapshot);
  const products = useMemo(() => parseProducts(snapshot), [snapshot]);
  const publicProducts = useMemo(() => products.filter(isPublicProduct), [products]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);
  const notify = useCallback((message: string) => {
    setToast({ id: Date.now(), message, tone: "success" });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);
  const addProduct = useCallback((product: Product) => {
    save([product, ...products]);
    notify("Product saved successfully.");
  }, [notify, products]);
  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      save(products.map((product) => product.id === id ? { ...product, ...updates, id } : product));
      notify("Product updated successfully.");
    },
    [notify, products],
  );
  const deleteProduct = useCallback(
    (id: string) => {
      save(products.filter((product) => product.id !== id));
      notify("Product deleted.");
    },
    [notify, products],
  );
  const toggleProductActive = useCallback(
    (id: string) => {
      save(products.map((product) => product.id === id ? { ...product, isActive: !product.isActive, status: product.isActive ? "Inactive" : (product.stock > 0 ? "Active" : "Out of Stock"), updatedAt: new Date().toISOString() } : product));
      notify("Product status updated.");
    },
    [notify, products],
  );
  const reduceStock = useCallback((items: Array<{ productId: string; quantity: number }>) => {
    const quantities = new Map(items.map((item) => [item.productId, item.quantity]));
    save(products.map((product) => {
      const quantity = quantities.get(product.id);
      if (!quantity) return product;
      const nextStock = Math.max(0, product.stock - quantity);
      return { ...product, stock: nextStock, status: nextStock === 0 ? "Out of Stock" : product.status, isActive: nextStock > 0 && product.isActive, sales: (product.sales ?? 0) + quantity, updatedAt: new Date().toISOString() };
    }));
  }, [products]);

  const value = useMemo<ProductContextValue>(() => ({
    products,
    publicProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    reduceStock,
  }), [products, publicProducts, addProduct, updateProduct, deleteProduct, toggleProductActive, reduceStock]);

  return <ProductContext.Provider value={value}>{children}<Toast toast={toast} onDismiss={() => setToast(null)} /></ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
}
