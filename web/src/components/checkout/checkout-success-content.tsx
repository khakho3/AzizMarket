"use client";

import Link from "next/link";
import { CheckIcon, MapPinIcon, TruckIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/utils/format-currency";

interface CheckoutSuccessContentProps {
  orderId?: string;
}

export function CheckoutSuccessContent({ orderId }: CheckoutSuccessContentProps) {
  const { orders } = useOrders();
  const order = orderId ? orders.find((candidate) => candidate.id === orderId) : orders[0];

  if (!order) {
    return <Container className="py-20 text-center"><p className="text-sm font-bold text-slate-500">Loading your order confirmation…</p></Container>;
  }

  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-900/5 sm:p-10">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckIcon className="size-10" /></span>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Thank you for shopping with AzizMarket</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Order placed successfully</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Your mock order has been saved in this browser. You can follow its progress from your orders page.</p>

        <dl className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Order ID</dt><dd className="mt-1 font-black text-slate-950">{order.id}</dd></div>
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Amount paid / payable now</dt><dd className="mt-1 font-black text-slate-950">{formatCurrency(order.amountPaid || order.total)}</dd></div>
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Payment agreement</dt><dd className="mt-1 font-black text-slate-950">{order.paymentAgreement}</dd></div>
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Estimated delivery</dt><dd className="mt-1 flex items-center gap-2 font-black text-slate-950"><TruckIcon className="size-4 text-emerald-700" /> {new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(order.estimatedDeliveryDate))}</dd></div>
          <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2"><dt className="text-xs text-slate-500">Delivery destination</dt><dd className="mt-1 flex items-center gap-2 font-black text-slate-950"><MapPinIcon className="size-4 text-emerald-700" /> {order.deliveryAddress.area}, {order.deliveryAddress.city}, {order.deliveryAddress.region}</dd></div>
        </dl>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href={`/orders/${order.id}`} className="rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-800">View Order</Link>
          <Link href="/products" className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-extrabold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50">Continue Shopping</Link>
        </div>
      </div>
    </section>
  );
}
