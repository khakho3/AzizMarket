"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPinIcon, MessageIcon, PackageIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { ChatModal } from "@/components/marketplace/chat-modal";
import { ConfirmationModal } from "@/components/orders/confirmation-modal";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/utils/format-currency";

export function OrderDetailsContent({ orderId }: { orderId: string }) {
  const { orders, cancelOrder } = useOrders();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [problemReported, setProblemReported] = useState(false);
  const order = orders.find((candidate) => candidate.id === orderId);

  if (!order) {
    return (
      <Container className="py-12 sm:py-16">
        <EmptyState
          icon={<PackageIcon className="size-8" />}
          title="Order not found"
          description={`We could not find ${orderId} in the orders saved in this browser.`}
          actionLabel="View All Orders"
          actionHref="/orders"
        />
      </Container>
    );
  }

  const canCancel = ["Order Placed", "Payment Pending"].includes(order.status);
  const firstItem = order.items[0];

  return (
    <>
      <section className="bg-slate-50/60 py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
            <div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Order details</p><h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{order.id}</h1><time dateTime={order.createdAt} className="mt-2 block text-sm text-slate-500">Placed {new Intl.DateTimeFormat("en-GH", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.createdAt))}</time></div>
            <div className="flex flex-wrap gap-2"><OrderStatusBadge status={order.status} /><OrderStatusBadge status={order.paymentStatus} /><OrderStatusBadge status={order.deliveryStatus} /></div>
          </div>

          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6"><h2 className="font-black text-slate-950">Products ordered</h2></div>
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <article key={item.productId} className="grid grid-cols-[5rem_1fr] gap-4 p-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:p-6">
                      <Link href={`/products/${item.productId}`} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"><Image src={item.productImage} alt={item.productName} fill sizes="96px" className="object-cover" /></Link>
                      <div><Link href={`/products/${item.productId}`} className="font-extrabold text-slate-950 hover:text-emerald-700">{item.productName}</Link><p className="mt-1 text-xs font-bold text-emerald-700">{item.sellerName}</p><p className="mt-2 text-xs text-slate-500">Quantity: {item.quantity} · {formatCurrency(item.unitPrice)} each</p><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPinIcon className="size-3.5" /> {item.location}</p></div>
                      <p className="col-span-2 text-right font-black text-slate-950 sm:col-span-1">{formatCurrency(item.unitPrice * item.quantity)}</p>
                    </article>
                  ))}
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="font-black text-slate-950">Buyer details</h2><dl className="mt-5 space-y-3 text-sm"><div><dt className="text-xs text-slate-500">Full name</dt><dd className="mt-1 font-bold text-slate-900">{order.buyer.fullName}</dd></div><div><dt className="text-xs text-slate-500">Email</dt><dd className="mt-1 font-bold text-slate-900">{order.buyer.email}</dd></div><div><dt className="text-xs text-slate-500">Phone</dt><dd className="mt-1 font-bold text-slate-900">{order.buyer.phone}</dd></div></dl></section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="font-black text-slate-950">Delivery address</h2><div className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600"><MapPinIcon className="mt-1 size-5 shrink-0 text-emerald-700" /><p>{order.deliveryAddress.street}<br />{order.deliveryAddress.area}, {order.deliveryAddress.city}<br />{order.deliveryAddress.region}, Ghana{order.deliveryAddress.instructions ? <><br /><span className="text-xs italic text-slate-500">“{order.deliveryAddress.instructions}”</span></> : null}</p></div></section>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="font-black text-slate-950">Delivery and tracking</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Delivery method</p><p className="mt-1 font-extrabold text-slate-900">{order.deliveryMethod.name}</p><p className="mt-1 text-xs text-slate-500">{order.deliveryMethod.estimatedPeriod}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Tracking number</p><p className="mt-1 font-extrabold text-slate-900">{order.trackingNumber ?? "Assigned after courier dispatch"}</p><p className="mt-1 text-xs text-slate-500">Estimated by {new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(order.estimatedDeliveryDate))}</p></div></div></section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="font-black text-slate-950">Order timeline</h2><div className="mt-6"><OrderTimeline status={order.status} createdAt={order.createdAt} /></div></section>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-28">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="font-black text-slate-950">Payment summary</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4 text-slate-600"><dt>Product subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div><div className="flex justify-between gap-4 text-slate-600"><dt>Delivery fee</dt><dd>{formatCurrency(order.deliveryFee)}</dd></div><div className="flex justify-between gap-4 text-slate-600"><dt>Platform fee</dt><dd>{formatCurrency(order.platformFee)}</dd></div>{order.discount > 0 ? <div className="flex justify-between gap-4 text-emerald-700"><dt>Product savings</dt><dd>-{formatCurrency(order.discount)}</dd></div> : null}<div className="flex justify-between gap-4 border-t border-slate-200 pt-3 font-black text-slate-950"><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div><div className="flex justify-between gap-4 text-slate-600"><dt>Amount paid</dt><dd>{formatCurrency(order.amountPaid)}</dd></div>{order.remainingBalance > 0 ? <div className="flex justify-between gap-4 font-bold text-amber-700"><dt>Remaining balance</dt><dd>{formatCurrency(order.remainingBalance)}</dd></div> : null}</dl><div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4 text-xs"><p className="flex justify-between gap-3"><span className="text-slate-500">Agreement</span><strong>{order.paymentAgreement}</strong></p><p className="flex justify-between gap-3"><span className="text-slate-500">Method</span><strong>{order.paymentMethod}</strong></p><p className="flex justify-between gap-3"><span className="text-slate-500">Status</span><strong>{order.paymentStatus}</strong></p></div></section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-black text-slate-950">Need help?</h2><div className="mt-4 grid gap-2"><button type="button" onClick={() => setChatOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-800"><MessageIcon className="size-4" /> Contact Seller</button><button type="button" onClick={() => setProblemReported(true)} disabled={problemReported} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-700 hover:border-amber-300 disabled:bg-emerald-50 disabled:text-emerald-700">{problemReported ? "Problem reported for review" : "Report a Problem"}</button>{canCancel ? <button type="button" onClick={() => setCancelOpen(true)} className="rounded-xl px-4 py-3 text-sm font-extrabold text-rose-600 hover:bg-rose-50">Cancel Order</button> : null}</div></section>
            </aside>
          </div>
        </Container>
      </section>

      {firstItem ? <ChatModal isOpen={chatOpen} productName={firstItem.productName} sellerName={firstItem.sellerName} onClose={() => setChatOpen(false)} /> : null}
      <ConfirmationModal isOpen={cancelOpen} title="Cancel this order?" description="This action updates the mock order to Cancelled. Any recorded demonstration payment will be marked for refund." confirmLabel="Cancel Order" onClose={() => setCancelOpen(false)} onConfirm={() => { cancelOrder(order.id); setCancelOpen(false); }} />
    </>
  );
}
