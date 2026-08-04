"use client";

import Image from "next/image";
import type { CartItem, PaymentAgreement } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  amountPayableNow: number;
  remainingBalance: number;
  agreement: PaymentAgreement;
  isLocalDelivery: boolean;
}

export function OrderSummary({ items, subtotal, deliveryFee, platformFee, discount, total, amountPayableNow, remainingBalance, agreement, isLocalDelivery }: OrderSummaryProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-28">
      <h2 className="text-lg font-black text-slate-950">Order summary</h2>
      <div className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-slate-100"><Image src={item.productImage} alt="" fill sizes="56px" className="object-cover" /></div>
            <div className="min-w-0 flex-1"><p className="line-clamp-2 text-xs font-extrabold text-slate-900">{item.productName}</p><p className="mt-1 text-xs text-slate-500">Qty {item.quantity} · {item.sellerName}</p></div>
            <p className="shrink-0 text-xs font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <dl className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
        <div className="flex justify-between text-slate-600"><dt>Product subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
        <div className="flex justify-between gap-4 text-slate-600"><dt>Delivery fee</dt><dd className="text-right">{deliveryFee ? formatCurrency(deliveryFee) : isLocalDelivery ? "Free — seller nearby" : "Free"}</dd></div>
        <div className="flex justify-between text-slate-600"><dt>Platform fee</dt><dd>{formatCurrency(platformFee)}</dd></div>
        {discount > 0 ? <div className="flex justify-between text-emerald-700"><dt>Product savings</dt><dd>-{formatCurrency(discount)}</dd></div> : null}
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-950"><dt>Final total</dt><dd>{formatCurrency(total)}</dd></div>
      </dl>
      <div className="mt-5 rounded-xl bg-emerald-50 p-4">
        <p className="text-xs font-bold text-emerald-700">{agreement}</p>
        <p className="mt-1 flex justify-between gap-4 font-black text-emerald-950"><span>Payable now</span><span>{formatCurrency(amountPayableNow)}</span></p>
        {remainingBalance > 0 ? <p className="mt-2 flex justify-between gap-4 text-xs text-emerald-800"><span>Remaining balance</span><strong>{formatCurrency(remainingBalance)}</strong></p> : null}
      </div>
    </aside>
  );
}
