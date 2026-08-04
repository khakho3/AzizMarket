"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Toast, type ToastMessage } from "@/components/common/toast";
import type { CartItem, CartState, Product } from "@/types";

const cartStorageKey = "azizmarket-cart";
const cartChangeEvent = "azizmarket-cart-change";
const emptyCartSnapshot = "[]";

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function subscribeToCart(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === cartStorageKey) callback();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(cartChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(cartChangeEvent, callback);
  };
}

function getCartSnapshot() {
  return window.localStorage.getItem(cartStorageKey) ?? emptyCartSnapshot;
}

function getServerCartSnapshot() {
  return emptyCartSnapshot;
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.productId === "string" &&
    typeof item.productName === "string" &&
    typeof item.productImage === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number" &&
    typeof item.availableStock === "number" &&
    typeof item.sellerId === "string" &&
    typeof item.sellerName === "string" &&
    Array.isArray(item.paymentTypes)
  );
}

function parseCart(snapshot: string): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event(cartChangeEvent));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const items = useMemo(() => parseCart(snapshot), [snapshot]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string, tone: ToastMessage["tone"]) => {
    setToast({ id: Date.now(), message, tone });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stock < 1) {
        showToast(`${product.name} is currently out of stock.`, "warning");
        return false;
      }

      const existingItem = items.find((item) => item.productId === product.id);
      const currentQuantity = existingItem?.quantity ?? 0;

      if (currentQuantity >= product.stock) {
        showToast(`Maximum available stock reached for ${product.name}.`, "warning");
        return false;
      }

      const nextQuantity = Math.min(currentQuantity + quantity, product.stock);
      const cartItem: CartItem = {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        price: product.price,
        previousPrice: product.previousPrice,
        quantity: nextQuantity,
        availableStock: product.stock,
        sellerId: product.seller.id,
        sellerName: product.seller.storeName,
        paymentTypes: product.paymentTypes,
        location: product.location,
        deliveryInfo: product.deliveryInfo,
      };
      const nextItems = existingItem
        ? items.map((item) => (item.productId === product.id ? cartItem : item))
        : [...items, cartItem];

      saveCart(nextItems);
      if (nextQuantity < currentQuantity + quantity) {
        showToast(`Only ${product.stock} units of ${product.name} are available.`, "warning");
      } else {
        showToast(`${product.name} added to your cart.`, "success");
      }
      return true;
    },
    [items, showToast],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const item = items.find((candidate) => candidate.productId === productId);
      saveCart(items.filter((candidate) => candidate.productId !== productId));
      if (item) showToast(`${item.productName} removed from your cart.`, "success");
    },
    [items, showToast],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const item = items.find((candidate) => candidate.productId === productId);
      if (!item) return;

      if (quantity > item.availableStock) {
        showToast(`Maximum available stock is ${item.availableStock}.`, "warning");
        return;
      }

      saveCart(
        items.map((candidate) =>
          candidate.productId === productId
            ? { ...candidate, quantity: Math.max(1, quantity) }
            : candidate,
        ),
      );
    },
    [items, showToast],
  );

  const clearCart = useCallback(() => {
    saveCart([]);
    showToast("Your cart has been cleared.", "success");
  }, [showToast]);

  const state = useMemo<CartState>(() => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const sellerCount = new Set(items.map((item) => item.sellerId)).size;
    const deliveryCost = items.length ? 35 + Math.max(0, sellerCount - 1) * 15 : 0;
    const platformFee = items.length ? Math.round(subtotal * 0.015 * 100) / 100 : 0;

    return {
      items,
      totalQuantity,
      subtotal,
      deliveryCost,
      platformFee,
      total: subtotal + deliveryCost + platformFee,
    };
  }, [items]);

  const contextValue = useMemo<CartContextValue>(
    () => ({ ...state, addItem, removeItem, updateQuantity, clearCart }),
    [state, addItem, removeItem, updateQuantity, clearCart],
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
