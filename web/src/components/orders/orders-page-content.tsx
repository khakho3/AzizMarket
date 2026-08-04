"use client";

import { useMemo, useState } from "react";
import { PackageIcon, SearchIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { OrderCard } from "@/components/orders/order-card";
import { useOrders } from "@/hooks/use-orders";
import type { Order } from "@/types";

const filters = ["All", "Pending", "Processing", "Shipped", "Delivered", "Completed", "Cancelled", "Disputed"] as const;
type OrderFilter = (typeof filters)[number];

function matchesFilter(order: Order, filter: OrderFilter) {
  if (filter === "All") return true;
  if (filter === "Pending") return ["Order Placed", "Payment Pending"].includes(order.status);
  if (filter === "Processing") return ["Payment Confirmed", "Seller Accepted", "Preparing Order", "Ready for Delivery"].includes(order.status);
  if (filter === "Shipped") return order.status === "Out for Delivery";
  return order.status === filter;
}

export function OrdersPageContent() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState<OrderFilter>("All");
  const [search, setSearch] = useState("");
  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => matchesFilter(order, filter) && (!query || order.id.toLowerCase().includes(query)));
  }, [orders, filter, search]);

  return (
    <section className="bg-slate-50/60 py-10 sm:py-14">
      <Container>
        <div className="relative max-w-xl"><label htmlFor="order-search" className="sr-only">Search by order ID</label><SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><input id="order-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order ID" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100" /></div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filter orders by status">
          {filters.map((option) => <button key={option} type="button" onClick={() => setFilter(option)} aria-pressed={filter === option} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold transition ${filter === option ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}>{option}</button>)}
        </div>
        {visibleOrders.length ? <div className="mt-7 grid gap-5">{visibleOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <div className="mt-7"><EmptyState icon={<PackageIcon className="size-8" />} title={orders.length ? "No matching orders" : "You have no orders yet"} description={orders.length ? "Try a different order ID or status filter." : "Orders you place on AzizMarket will appear here with tracking updates."} actionLabel="Browse Products" actionHref="/products" /></div>}
      </Container>
    </section>
  );
}
