"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon, MapPinIcon, MessageIcon, StoreIcon } from "@/components/common/icons";
import type { Seller } from "@/types";

interface SellerInformationCardProps {
  seller: Seller;
  onChat: () => void;
}

export function SellerInformationCard({ seller, onChat }: SellerInformationCardProps) {
  const [reported, setReported] = useState(false);
  const joinedDate = new Intl.DateTimeFormat("en-GH", {
    month: "long",
    year: "numeric",
  }).format(new Date(seller.joinedAt));

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Seller information</p>
      <div className="mt-5 flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800">
          {seller.initials}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-black text-slate-950">{seller.storeName}</h2>
            {seller.verified ? (
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-700 text-white" title="Verified seller">
                <CheckIcon className="size-3" />
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-bold text-emerald-700">Verified marketplace seller</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-500">{seller.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Seller rating</dt>
          <dd className="mt-1 font-black text-slate-900"><span className="text-amber-500">★</span> {seller.rating} <span className="text-xs font-normal text-slate-400">({seller.reviewCount})</span></dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Products</dt>
          <dd className="mt-1 font-black text-slate-900">{seller.productCount}</dd>
        </div>
      </dl>

      <div className="mt-5 space-y-2 text-xs text-slate-500">
        <p className="flex items-center gap-2"><MapPinIcon className="size-4 text-emerald-700" /> {seller.location}, Ghana</p>
        <p className="flex items-center gap-2"><StoreIcon className="size-4 text-emerald-700" /> Joined {joinedDate}</p>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <Link
          href={`/products?q=${encodeURIComponent(seller.storeName)}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-800"
        >
          <StoreIcon className="size-4" /> View Store
        </Link>
        <button
          type="button"
          onClick={onChat}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
        >
          <MessageIcon className="size-4" /> Chat with Seller
        </button>
      </div>
      <button
        type="button"
        onClick={() => setReported(true)}
        disabled={reported}
        className="mt-4 w-full text-center text-xs font-bold text-slate-400 hover:text-rose-600 disabled:text-emerald-700"
      >
        {reported ? "Report received for review" : "Report Seller"}
      </button>
    </aside>
  );
}
