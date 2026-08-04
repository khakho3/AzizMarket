"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/common/container";
import { ProductGrid } from "@/components/marketplace/product-grid";
import { useProducts } from "@/context/product-context";
import { useSeller } from "@/context/seller-context";
import { useAdmin } from "@/context/admin-context";

export function PublicStorePage({ id }: { id: string }) {
  const { seller, store } = useSeller();
  const { publicProducts } = useProducts();
  const { sellerRecords } = useAdmin();
  const [notice, setNotice] = useState("");
  if (id !== seller.id) return <Container className="py-24 text-center"><h1 className="text-3xl font-black">Store not found</h1><Link href="/products" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Browse marketplace</Link></Container>;
  const sellerRecord = sellerRecords.find((item) => item.sellerId === seller.id);
  const products = ["Suspended", "Banned", "Rejected"].includes(sellerRecord?.status ?? "Active") ? [] : publicProducts.filter((product) => product.seller.id === seller.id);
  return <>{notice ? <div className="fixed right-4 top-24 z-50 rounded-xl bg-emerald-950 px-5 py-3 text-sm font-bold text-white shadow-xl">{notice}</div> : null}<section className="relative overflow-hidden bg-emerald-950 text-white"><div className="absolute inset-0"><Image src={store.banner} alt="" fill priority sizes="100vw" className="object-cover opacity-20" /></div><Container className="relative py-14 sm:py-20"><div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center"><div className="relative size-24 overflow-hidden rounded-3xl border-4 border-white/20 bg-white"><Image src={store.logo} alt={`${store.storeName} logo`} fill sizes="96px" className="object-cover" /></div><div className="flex-1"><div className="flex items-center gap-2"><h1 className="text-3xl font-black sm:text-4xl">{store.storeName}</h1>{seller.verified ? <span className="rounded-full bg-emerald-400 px-2 py-1 text-xs font-black text-emerald-950">✓ Verified</span> : null}</div><p className="mt-2 text-sm text-emerald-100">★ {seller.rating} ({seller.reviewCount} reviews) · {store.city}, {store.region}</p><p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50">{store.description}</p></div><div className="flex gap-2"><button type="button" onClick={() => setNotice("Chat will open when buyer messaging is connected.")} className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950">Chat with Seller</button><button type="button" onClick={() => setNotice("Store report recorded for this frontend demonstration.")} className="rounded-xl border border-white/30 px-4 py-3 text-sm font-bold">Report Store</button></div></div></Container></section><section className="py-14"><Container><div className="mb-8"><h2 className="text-2xl font-black">Products from {store.storeName}</h2><p className="mt-2 text-sm text-slate-500">{products.length ? `${products.length} active marketplace products` : "No active products yet"}</p></div>{products.length ? <ProductGrid products={products} /> : <div className="rounded-2xl border border-dashed border-slate-300 p-14 text-center text-slate-500">This store has no active products.</div>}</Container></section></>;
}
