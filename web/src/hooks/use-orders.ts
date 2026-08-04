"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getOrdersSnapshot,
  getServerOrdersSnapshot,
  parseOrders,
  saveOrders,
  subscribeToOrders,
} from "@/services/order-storage";
import type { Order } from "@/types";

export function useOrders() {
  const snapshot = useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getServerOrdersSnapshot,
  );
  const orders = useMemo(() => parseOrders(snapshot), [snapshot]);

  const cancelOrder = useCallback(
    (orderId: string) => {
      saveOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "Cancelled" as const,
                deliveryStatus: "Cancelled" as const,
                paymentStatus:
                  order.amountPaid > 0 ? ("Refunded" as const) : order.paymentStatus,
                timeline: [...(order.timeline ?? []), { status: "Cancelled" as const, description: "The buyer cancelled the order.", createdAt: new Date().toISOString(), actor: "Buyer" as const }],
              }
            : order,
        ),
      );
    },
    [orders],
  );

  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    saveOrders(orders.map((order) => order.id === orderId ? { ...order, ...updates, id: order.id, updatedAt: new Date().toISOString() } : order));
  }, [orders]);

  return { orders, cancelOrder, updateOrder };
}
