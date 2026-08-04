"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CartIcon,
  CheckIcon,
  HeartIcon,
  MapPinIcon,
  MessageIcon,
  PaymentIcon,
} from "@/components/common/icons";
import { ChatModal } from "@/components/marketplace/chat-modal";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [favourite, setFavourite] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const discount = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0;

  return (
    <>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/8">
        <Link
          href={`/products/${product.id}`}
          className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2 pr-12">
            {discount > 0 ? (
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                -{discount}%
              </span>
            ) : null}
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${product.stock > 0 ? "bg-white/95 text-emerald-800" : "bg-slate-900 text-white"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setFavourite((current) => !current)}
          aria-label={favourite ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
          aria-pressed={favourite}
          className={`absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full shadow-sm transition ${favourite ? "bg-rose-600 text-white" : "bg-white/95 text-slate-600 hover:text-rose-600"}`}
        >
          <HeartIcon className={`size-4 ${favourite ? "fill-current" : ""}`} />
        </button>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex min-w-0 items-center gap-1.5 truncate font-semibold text-emerald-700">
              <span className="truncate">{product.seller.storeName}</span>
              {product.seller.verified ? (
                <span title="Verified seller" className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-700 text-white">
                  <CheckIcon className="size-2.5" />
                </span>
              ) : null}
            </span>
            <span className="shrink-0 font-bold text-slate-700">
              <span className="text-amber-500" aria-hidden="true">★</span>{" "}
              {product.rating.toFixed(1)}
              <span className="font-normal text-slate-400"> ({product.reviewCount})</span>
            </span>
          </div>

          <Link href={`/products/${product.id}`} className="mt-2">
            <h3 className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-slate-900 transition group-hover:text-emerald-700">
              {product.name}
            </h3>
          </Link>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-xl font-black tracking-tight text-slate-950">
              {formatCurrency(product.price)}
            </p>
            {product.previousPrice ? (
              <p className="text-xs font-semibold text-slate-400 line-through">
                {formatCurrency(product.previousPrice)}
              </p>
            ) : null}
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <p className="flex items-center gap-2">
              <MapPinIcon className="size-4 shrink-0 text-slate-400" />
              {product.location}, Ghana
            </p>
            <p className="flex items-start gap-2">
              <PaymentIcon className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <span className="line-clamp-1">
                {product.paymentTypes[0]}
                {product.paymentTypes.length > 1 ? ` +${product.paymentTypes.length - 1}` : ""}
              </span>
            </p>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={() => {
                if (addItem(product)) {
                  setAddedToCart(true);
                  window.setTimeout(() => setAddedToCart(false), 2000);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {addedToCart ? <CheckIcon className="size-4" /> : <CartIcon className="size-4" />}
              {addedToCart ? "Added" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <MessageIcon className="size-4" /> Chat with Seller
            </button>
          </div>
        </div>
      </article>

      <ChatModal
        isOpen={chatOpen}
        productName={product.name}
        sellerName={product.seller.storeName}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
