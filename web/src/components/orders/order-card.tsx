import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/icons";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import type { Order } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

export function OrderCard({ order }: { order: Order }) {
  const sellerNames = [...new Set(order.items.map((item) => item.sellerName))];
  const productCount = order.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-lg hover:shadow-slate-900/5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Order</p><h2 className="mt-1 font-black text-slate-950">{order.id}</h2><time dateTime={order.createdAt} className="mt-1 block text-xs text-slate-500">{new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt))}</time></div>
        <div className="flex flex-wrap gap-2"><OrderStatusBadge status={order.status} /><OrderStatusBadge status={order.paymentStatus} /><OrderStatusBadge status={order.deliveryStatus} /></div>
      </div>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item) => <div key={item.productId} className="relative size-16 overflow-hidden rounded-xl border-2 border-white bg-slate-100"><Image src={item.productImage} alt={item.productName} fill sizes="64px" className="object-cover" /></div>)}
        </div>
        <div className="min-w-0 flex-1"><p className="font-extrabold text-slate-900">{productCount} {productCount === 1 ? "product" : "products"}</p><p className="mt-1 truncate text-sm text-slate-500">Sold by {sellerNames.join(", ")}</p></div>
        <div className="sm:text-right"><p className="text-xs text-slate-500">Order total</p><p className="mt-1 text-lg font-black text-slate-950">{formatCurrency(order.total)}</p></div>
      </div>
      <Link href={`/orders/${order.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 hover:text-emerald-900">View Details <ArrowRightIcon className="size-4" /></Link>
    </article>
  );
}
