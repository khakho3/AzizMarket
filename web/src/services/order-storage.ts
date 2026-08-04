"use client";

import { products } from "@/data/products";
import { deliveryMethods } from "@/data/checkout";
import type { CartItem, Order, OrderItem, OrderStatus, Product } from "@/types";

export const ordersStorageKey = "azizmarket-orders";
export const lastOrderStorageKey = "azizmarket-last-order";
export const ordersChangeEvent = "azizmarket-orders-change";
const emptyOrdersSnapshot = "[]";

function toOrderItem(product: Product, quantity: number): OrderItem {
  return {
    productId: product.id,
    productName: product.name,
    productImage: product.images[0],
    price: product.price,
    previousPrice: product.previousPrice,
    unitPrice: product.price,
    quantity,
    availableStock: product.stock,
    sellerId: product.seller.id,
    sellerName: product.seller.storeName,
    paymentTypes: product.paymentTypes,
    location: product.location,
    deliveryInfo: product.deliveryInfo,
  };
}

function sampleOrder(
  id: string,
  product: Product,
  status: OrderStatus,
  createdAt: string,
  quantity: number,
): Order {
  const item = toOrderItem(product, quantity);
  const subtotal = item.price * quantity;
  const deliveryFee = 35;
  const platformFee = Math.round(subtotal * 0.015 * 100) / 100;
  const total = subtotal + deliveryFee + platformFee;
  const isPaid = !["Order Placed", "Payment Pending"].includes(status);
  const delivered = ["Delivered", "Completed"].includes(status);

  return {
    id,
    createdAt,
    buyer: {
      fullName: "Hassan Abdul Aziz",
      email: "hassan@example.com",
      phone: "+233 24 000 0000",
    },
    deliveryAddress: {
      region: "Greater Accra",
      city: "Accra",
      area: "East Legon",
      street: "Lagos Avenue, near the community library",
      instructions: "Call when you arrive at the gate.",
    },
    deliveryMethod: deliveryMethods[0],
    paymentAgreement: "Full Payment",
    paymentMethod: "Mobile Money",
    items: [item],
    status,
    paymentStatus: isPaid ? "Paid" : "Pending",
    deliveryStatus: delivered
      ? "Delivered"
      : status === "Out for Delivery"
        ? "In Transit"
        : status === "Preparing Order"
          ? "Preparing"
          : "Awaiting Fulfilment",
    subtotal,
    deliveryFee,
    platformFee,
    discount: product.previousPrice
      ? (product.previousPrice - product.price) * quantity
      : 0,
    total,
    amountPaid: isPaid ? total : 0,
    remainingBalance: isPaid ? 0 : total,
    currency: "GHS",
    estimatedDeliveryDate: "2026-08-08",
    trackingNumber: status === "Out for Delivery" ? "AZM-GH-482901" : undefined,
  };
}

export function createSampleOrders(): Order[] {
  return [
    sampleOrder("ORD-2026-0001", products[6], "Completed", "2026-06-18T10:24:00.000Z", 1),
    sampleOrder("ORD-2026-0004", products[7], "Seller Accepted", "2026-08-02T13:12:00.000Z", 2),
    sampleOrder("ORD-2026-0005", products[6], "Order Placed", "2026-08-03T08:30:00.000Z", 1),
    sampleOrder("ORD-2026-0002", products[8], "Out for Delivery", "2026-07-24T15:10:00.000Z", 1),
    sampleOrder("ORD-2026-0003", products[0], "Payment Pending", "2026-08-01T09:42:00.000Z", 1),
  ];
}

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<Order>;
  return (
    typeof order.id === "string" &&
    typeof order.createdAt === "string" &&
    Array.isArray(order.items) &&
    typeof order.total === "number" &&
    typeof order.status === "string"
  );
}

export function parseOrders(snapshot: string): Order[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isOrder) : [];
  } catch {
    return [];
  }
}

export function getOrdersSnapshot() {
  return window.localStorage.getItem(ordersStorageKey) ?? emptyOrdersSnapshot;
}

export function getServerOrdersSnapshot() {
  return emptyOrdersSnapshot;
}

export function subscribeToOrders(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === ordersStorageKey) callback();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ordersChangeEvent, callback);

  const storedOrders = window.localStorage.getItem(ordersStorageKey);
  if (!storedOrders || parseOrders(storedOrders).length === 0) {
    window.localStorage.setItem(ordersStorageKey, JSON.stringify(createSampleOrders()));
    queueMicrotask(callback);
  }

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ordersChangeEvent, callback);
  };
}

export function getStoredOrders(): Order[] {
  const stored = window.localStorage.getItem(ordersStorageKey);
  return stored ? parseOrders(stored) : createSampleOrders();
}

export function saveOrders(orders: Order[]) {
  window.localStorage.setItem(ordersStorageKey, JSON.stringify(orders));
  window.dispatchEvent(new Event(ordersChangeEvent));
}

export function saveOrder(order: Order) {
  saveOrders([order, ...getStoredOrders().filter((existing) => existing.id !== order.id)]);
  window.localStorage.setItem(lastOrderStorageKey, order.id);
}

export function createOrderId(orders: Order[]): string {
  const year = new Date().getFullYear();
  const largestSequence = orders.reduce((largest, order) => {
    const sequence = Number(order.id.split("-").at(-1));
    return Number.isFinite(sequence) ? Math.max(largest, sequence) : largest;
  }, 0);
  return `ORD-${year}-${String(largestSequence + 1).padStart(4, "0")}`;
}

export function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({ ...item, unitPrice: item.price }));
}
