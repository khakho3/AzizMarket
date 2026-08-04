"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { Container } from "@/components/common/container";
import {
  CartIcon,
  CheckIcon,
  HeartIcon,
  MapPinIcon,
  MessageIcon,
  PaymentIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/common/icons";
import { ChatModal } from "@/components/marketplace/chat-modal";
import { SellerInformationCard } from "@/components/marketplace/seller-information-card";
import { useCart } from "@/context/cart-context";
import { useCategories } from "@/context/category-context";
import { useBuyerNavigation } from "@/hooks/use-buyer-navigation";
import type { Product } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

interface ProductDetailsViewProps {
  product: Product;
}

export function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const { addItem } = useCart();
  const { categories } = useCategories();
  const { navigateToBuyerRoute, isAuthLoading } = useBuyerNavigation();
  const category = categories.find((candidate) => candidate.id === product.categoryId);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [favourite, setFavourite] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);
  const discount = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0;

  function addToCart() {
    if (addItem(product, quantity)) {
      setCartFeedback(true);
      window.setTimeout(() => setCartFeedback(false), 2500);
      return true;
    }
    return false;
  }

  return (
    <>
      <section className="pb-14 sm:pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] xl:gap-14">
            <div className="grid gap-3 sm:grid-cols-[5rem_1fr] sm:items-start">
              <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImage === image}
                    className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition ${selectedImage === image ? "border-emerald-600" : "border-transparent hover:border-slate-300"}`}
                  >
                    <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
              <div className="relative order-1 aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 sm:order-2">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="py-1 lg:py-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/categories/${category?.slug ?? ""}`} className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700 hover:text-emerald-900">
                    {category?.name ?? "Marketplace"}
                  </Link>
                  <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                    {product.name}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setFavourite((current) => !current)}
                  aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
                  aria-pressed={favourite}
                  className={`grid size-11 shrink-0 place-items-center rounded-full border transition ${favourite ? "border-rose-600 bg-rose-600 text-white" : "border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600"}`}
                >
                  <HeartIcon className={`size-5 ${favourite ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="font-bold text-slate-800">
                  <span className="text-amber-500">★</span> {product.rating.toFixed(1)}
                  <span className="font-normal text-slate-500"> ({product.reviewCount} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <MapPinIcon className="size-4" /> {product.location}, Ghana
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <p className="text-3xl font-black text-slate-950 sm:text-4xl">{formatCurrency(product.price)}</p>
                {product.previousPrice ? (
                  <p className="text-base font-semibold text-slate-400 line-through">{formatCurrency(product.previousPrice)}</p>
                ) : null}
                {discount > 0 ? (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700">Save {discount}%</span>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm sm:grid-cols-2">
                <p><span className="block text-xs text-slate-500">Availability</span><strong className={product.stock > 0 ? "mt-1 block text-emerald-700" : "mt-1 block text-rose-700"}>{product.stock > 0 ? `${product.stock} units in stock` : "Currently out of stock"}</strong></p>
                <p><span className="block text-xs text-slate-500">Condition</span><strong className="mt-1 block text-slate-900">{product.condition}</strong></p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-extrabold text-slate-900">Available payment types</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.paymentTypes.map((paymentType) => (
                    <span key={paymentType} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                      <PaymentIcon className="size-3.5" /> {paymentType}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                <p className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                  <TruckIcon className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                  <span><strong className="block text-slate-900">Delivery information</strong>{product.deliveryInfo}</span>
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div>
                  <label className="text-sm font-extrabold text-slate-900">Quantity</label>
                  <div className="mt-2"><QuantitySelector quantity={quantity} maximum={Math.max(1, product.stock)} onChange={setQuantity} /></div>
                </div>
                <p className="pb-3 text-xs text-slate-500">Maximum {product.stock || 0} available</p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" disabled={product.stock === 0} onClick={addToCart} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                  {cartFeedback ? <CheckIcon className="size-5" /> : <CartIcon className="size-5" />} {cartFeedback ? `${quantity} added to cart` : "Add to Cart"}
                </button>
                <button type="button" disabled={product.stock === 0 || isAuthLoading} onClick={() => { if (addToCart()) navigateToBuyerRoute("/checkout"); }} className="rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300">
                  Buy Now
                </button>
                <button type="button" onClick={() => setChatOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-extrabold text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 sm:col-span-2">
                  <MessageIcon className="size-5" /> Chat with Seller
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2"><ShieldIcon className="size-4 text-emerald-700" /> Buyer protection</span>
                <span className="flex items-center gap-2"><CheckIcon className="size-4 text-emerald-700" /> Verified seller</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-14 sm:py-20">
        <Container className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-8">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-black text-slate-950">Product description</h2>
              <p className="mt-4 leading-7 text-slate-600">{product.description}</p>
            </article>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-6 py-5 sm:px-8"><h2 className="text-xl font-black text-slate-950">Product specifications</h2></div>
              <dl className="divide-y divide-slate-100">
                {product.specifications.map((specification) => (
                  <div key={specification.label} className="grid gap-1 px-6 py-4 text-sm sm:grid-cols-[12rem_1fr] sm:px-8">
                    <dt className="font-bold text-slate-500">{specification.label}</dt>
                    <dd className="font-semibold text-slate-900">{specification.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><h2 className="text-2xl font-black text-slate-950">Customer reviews</h2><p className="mt-1 text-sm text-slate-500">Feedback from verified buyers</p></div>
                <div className="text-right"><p className="text-3xl font-black text-slate-950">{product.rating.toFixed(1)}</p><p className="text-sm font-bold text-amber-500">★★★★★</p><p className="text-xs text-slate-400">{product.reviewCount} reviews</p></div>
              </div>
              <div className="mt-7 divide-y divide-slate-100 border-t border-slate-100">
                {product.reviews.map((review) => (
                  <article key={review.id} className="py-6">
                    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-extrabold text-slate-900">{review.author}</p><p className="mt-1 text-xs font-bold text-amber-500">{"★".repeat(Math.round(review.rating))}</p></div><time dateTime={review.createdAt} className="text-xs text-slate-400">{new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(review.createdAt))}</time></div>
                    {review.verifiedPurchase ? <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700"><CheckIcon className="size-3.5" /> Verified purchase</p> : null}
                    <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="xl:sticky xl:top-28">
            <SellerInformationCard seller={product.seller} onChat={() => setChatOpen(true)} />
          </div>
        </Container>
      </section>

      <ChatModal isOpen={chatOpen} productName={product.name} sellerName={product.seller.storeName} onClose={() => setChatOpen(false)} />
    </>
  );
}
