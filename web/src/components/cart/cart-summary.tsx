"use client";

import Link from "next/link";
import { CartIcon, ShieldIcon } from "@/components/common/icons";
import { useCart } from "@/context/cart-context";
import { useBuyerNavigation } from "@/hooks/use-buyer-navigation";
import { formatCurrency } from "@/utils/format-currency";

export function CartSummary() {
  const { subtotal, deliveryCost, platformFee, total, items } = useCart();
  const { navigateToBuyerRoute, isAuthLoading } = useBuyerNavigation();

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-28">
      <h2 className="text-lg font-black text-slate-950">Cart summary</h2>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between gap-4 text-slate-600"><dt>Subtotal</dt><dd className="font-bold text-slate-900">{formatCurrency(subtotal)}</dd></div>
        <div className="flex justify-between gap-4 text-slate-600"><dt>Estimated delivery</dt><dd className="font-bold text-slate-900">{formatCurrency(deliveryCost)}</dd></div>
        <div className="flex justify-between gap-4 text-slate-600"><dt>Platform fee</dt><dd className="font-bold text-slate-900">{formatCurrency(platformFee)}</dd></div>
        <div className="flex justify-between gap-4 border-t border-slate-200 pt-4 text-base"><dt className="font-extrabold">Estimated total</dt><dd className="font-black">{formatCurrency(total)}</dd></div>
      </dl>
      {items.length ? (
        <button
          type="button"
          disabled={isAuthLoading}
          onClick={() => navigateToBuyerRoute("/checkout")}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:bg-emerald-500"
        >
          <CartIcon className="size-5" />
          {isAuthLoading ? "Checking account..." : "Proceed to Checkout"}
        </button>
      ) : (
        <Link
          href="/products"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-800"
        >
          <CartIcon className="size-5" /> Browse Products
        </Link>
      )}
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
        <ShieldIcon className="mt-0.5 size-4 shrink-0 text-emerald-700" /> Final delivery fees depend on your selected checkout method.
      </p>
    </aside>
  );
}
