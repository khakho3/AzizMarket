"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CartIcon, StoreIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/context/cart-context";

export function CartPageContent() {
  const { items, totalQuantity, clearCart } = useCart();
  const sellerGroups = useMemo(() => {
    return items.reduce<Record<string, typeof items>>((groups, item) => {
      groups[item.sellerName] = [...(groups[item.sellerName] ?? []), item];
      return groups;
    }, {});
  }, [items]);

  if (!items.length) {
    return (
      <Container className="py-12 sm:py-16">
        <EmptyState
          icon={<CartIcon className="size-8" />}
          title="Your cart is empty"
          description="Products you add from AzizMarket will appear here, ready for checkout when you are."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      </Container>
    );
  }

  return (
    <section className="bg-slate-50/60 py-10 sm:py-14">
      <Container>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">{totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart</h2>
            <p className="mt-1 text-sm text-slate-500">Products are grouped by seller for easier delivery planning.</p>
          </div>
          <button type="button" onClick={clearCart} className="text-sm font-extrabold text-rose-600 hover:text-rose-800">Clear Cart</button>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-10">
          <div className="space-y-5">
            {Object.entries(sellerGroups).map(([sellerName, sellerItems]) => (
              <section key={sellerName} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700"><StoreIcon className="size-4" /></span>
                  <div><h3 className="text-sm font-black text-slate-900">{sellerName}</h3><p className="text-xs text-slate-500">{sellerItems.length} {sellerItems.length === 1 ? "product" : "products"}</p></div>
                </div>
                <div className="divide-y divide-slate-100">
                  {sellerItems.map((item) => <CartItem key={item.productId} item={item} />)}
                </div>
              </section>
            ))}
            <Link href="/products" className="inline-flex py-2 text-sm font-extrabold text-emerald-700 hover:text-emerald-900">← Continue Shopping</Link>
          </div>
          <CartSummary />
        </div>
      </Container>
    </section>
  );
}
