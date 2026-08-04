"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, PaymentIcon, TruckIcon } from "@/components/common/icons";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { useCart } from "@/context/cart-context";
import type { CartItem as CartItemType } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <article className="grid grid-cols-[6rem_1fr] gap-4 p-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:p-5">
      <Link href={`/products/${item.productId}`} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
        <Image src={item.productImage} alt={item.productName} fill sizes="128px" className="object-cover" />
      </Link>
      <div className="min-w-0">
        <Link href={`/products/${item.productId}`} className="line-clamp-2 font-extrabold text-slate-950 hover:text-emerald-700">
          {item.productName}
        </Link>
        <p className="mt-1 text-sm font-black text-slate-900">{formatCurrency(item.price)}</p>
        <div className="mt-3 space-y-1.5 text-xs text-slate-500">
          <p className="flex items-center gap-2"><MapPinIcon className="size-3.5 text-emerald-700" /> {item.location}, Ghana</p>
          <p className="flex items-center gap-2"><PaymentIcon className="size-3.5 text-emerald-700" /> {item.paymentTypes.join(" · ")}</p>
          <p className="flex items-start gap-2"><TruckIcon className="mt-0.5 size-3.5 shrink-0 text-emerald-700" /><span className="line-clamp-1">{item.deliveryInfo}</span></p>
        </div>
        <p className={`mt-3 text-xs font-bold ${item.quantity >= item.availableStock ? "text-amber-700" : "text-emerald-700"}`}>
          {item.quantity >= item.availableStock
            ? `Maximum available quantity reached (${item.availableStock})`
            : `${item.availableStock} available`}
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:col-span-1 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <p className="text-base font-black text-slate-950">{formatCurrency(item.price * item.quantity)}</p>
        <QuantitySelector
          quantity={item.quantity}
          maximum={item.availableStock}
          onChange={(quantity) => updateQuantity(item.productId, quantity)}
          compact
        />
        <button type="button" onClick={() => removeItem(item.productId)} className="text-xs font-extrabold text-rose-600 hover:text-rose-800">
          Remove
        </button>
      </div>
    </article>
  );
}
