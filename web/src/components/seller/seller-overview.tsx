"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardStatCard } from "@/components/seller/dashboard-stat-card";
import { StatusBadge } from "@/components/seller/status-badge";
import { useProducts } from "@/context/product-context";
import { useSeller } from "@/context/seller-context";
import { currentSeller } from "@/data/current-seller";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/utils/format-currency";
import { getProductStatus } from "@/utils/product-status";

export function SellerOverview({
  showRegistrationSuccess = false,
}: {
  showRegistrationSuccess?: boolean;
}) {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { conversations } = useSeller();
  const sellerProducts = products.filter((product) => product.seller.id === currentSeller.id);
  const sellerOrders = orders.filter((order) => order.items.some((item) => item.sellerId === currentSeller.id));
  const sellerRevenue = sellerOrders.filter((order) => ["Delivered", "Completed"].includes(order.status)).reduce((total, order) => total + order.items.filter((item) => item.sellerId === currentSeller.id).reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), 0);
  const commission = sellerRevenue * 0.1;
  const lowStock = sellerProducts.filter((product) => product.stock > 0 && product.stock <= (product.lowStockThreshold ?? 5)).sort((a, b) => a.stock - b.stock);
  const bestSelling = [...sellerProducts].sort((a, b) => (b.sales ?? b.reviewCount) - (a.sales ?? a.reviewCount)).slice(0, 4);
  const recentOrders = [...sellerOrders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5);
  const stats = [
    ["Total products", sellerProducts.length.toString()],
    ["Active products", sellerProducts.filter((product) => getProductStatus(product) === "Active").length.toString()],
    ["Out of stock", sellerProducts.filter((product) => product.stock === 0).length.toString()],
    ["Pending orders", sellerOrders.filter((order) => ["Order Placed", "Payment Pending"].includes(order.status)).length.toString()],
    ["Processing orders", sellerOrders.filter((order) => ["Seller Accepted", "Preparing Order", "Ready for Delivery", "Out for Delivery"].includes(order.status)).length.toString()],
    ["Completed orders", sellerOrders.filter((order) => order.status === "Completed").length.toString()],
    ["Total sales", formatCurrency(sellerRevenue)],
    ["Available balance", formatCurrency(Math.max(0, sellerRevenue - commission))],
  ];
  return <>
    {showRegistrationSuccess ? (
      <section role="status" aria-live="polite" className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
        <h2 className="text-lg font-black">Seller account created successfully</h2>
        <p className="mt-2 text-sm leading-6">Seller verification is pending, so your store may remain inactive publicly until an admin approves it. You can complete your store profile and add products for review while you wait.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/seller/store" className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950">Complete Store</Link>
          <Link href="/seller/products/new" className="rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-black text-amber-900">Add Product for Review</Link>
        </div>
      </section>
    ) : null}
    <div><p className="text-sm font-bold text-emerald-700">{currentSeller.storeName}</p><h1 className="mt-1 text-3xl font-black text-slate-950">Seller overview</h1><p className="mt-2 text-sm text-slate-500">Store performance and actions that need your attention.</p></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <DashboardStatCard key={label} label={label} value={value} />)}</div>
    <section className="mt-6 rounded-2xl bg-emerald-950 p-5 text-white"><div className="flex flex-wrap gap-3"><Link href="/seller/products/new" className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950">Add Product</Link><Link href="/seller/orders" className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold">View Orders</Link><Link href="/seller/store" className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold">Update Store</Link><Link href="/seller/messages" className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold">View Messages</Link></div></section>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-200 p-5"><h2 className="font-black">Recent orders</h2><Link href="/seller/orders" className="text-xs font-bold text-emerald-700">View all</Link></div>{recentOrders.length ? <div className="divide-y divide-slate-100">{recentOrders.map((order) => <Link href={`/seller/orders/${order.id}`} key={order.id} className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50"><div><p className="text-sm font-black">{order.id}</p><p className="mt-1 text-xs text-slate-500">{order.buyer.fullName} · {new Date(order.createdAt).toLocaleDateString("en-GH")}</p></div><StatusBadge status={order.status} /></Link>)}</div> : <p className="p-8 text-center text-sm text-slate-500">No seller orders yet.</p>}</section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-black">Sales activity</h2><p className="mt-1 text-xs text-slate-500">Simple seven-day visual summary</p><div className="mt-7 flex h-44 items-end gap-3">{[34, 52, 42, 68, 58, 82, 74].map((height, index) => <div key={height + index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-emerald-600" style={{ height: `${height}%` }} /><span className="text-[10px] text-slate-400">{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}</div></section>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-black">Best-selling products</h2><div className="mt-4 space-y-3">{bestSelling.map((product) => <div key={product.id} className="flex items-center gap-3"><div className="relative size-11 overflow-hidden rounded-lg bg-slate-100"><Image src={product.images[0]} alt="" fill sizes="44px" className="object-cover" /></div><div className="min-w-0"><p className="truncate text-sm font-bold">{product.name}</p><p className="text-xs text-slate-500">{product.sales ?? product.reviewCount} sales</p></div></div>)}</div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-black">Low-stock products</h2><div className="mt-4 space-y-3">{lowStock.length ? lowStock.slice(0, 5).map((product) => <Link key={product.id} href={`/seller/products/${product.id}/edit`} className="flex justify-between gap-3 text-sm"><span className="truncate font-bold">{product.name}</span><span className="font-black text-amber-700">{product.stock} left</span></Link>) : <p className="text-sm text-slate-500">Stock levels look healthy.</p>}</div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-black">Recent messages</h2><div className="mt-4 space-y-3">{conversations.slice(0, 4).map((conversation) => <Link key={conversation.id} href={`/seller/messages?conversation=${conversation.id}`} className="block rounded-xl bg-slate-50 p-3"><div className="flex justify-between"><p className="text-sm font-black">{conversation.buyerName}</p>{conversation.unreadCount ? <span className="grid size-5 place-items-center rounded-full bg-rose-600 text-[10px] text-white">{conversation.unreadCount}</span> : null}</div><p className="mt-1 truncate text-xs text-slate-500">{conversation.messages.at(-1)?.text}</p></Link>)}</div></section>
    </div>
  </>;
}
