"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, MessageIcon } from "@/components/common/icons";
import { useSeller } from "@/context/seller-context";

export function SellerHeader({ onMenu }: { onMenu: () => void }) {
  const { seller, conversations } = useSeller();
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = conversations.reduce((total, conversation) => total + conversation.unreadCount, 0);
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><button type="button" onClick={onMenu} className="grid size-10 place-items-center rounded-xl border border-slate-200 lg:hidden" aria-label="Open seller navigation"><MenuIcon className="size-5" /></button><div><p className="text-xs font-bold text-slate-400">Welcome back</p><p className="text-sm font-black text-slate-900">{seller.ownerName}</p></div></div>
      <div className="flex items-center gap-2">
        <button type="button" className="relative grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Notifications"><span aria-hidden="true">🔔</span><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-amber-400" /></button>
        <Link href="/seller/messages" className="relative grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label={`${unread} unread messages`}><MessageIcon className="size-5" />{unread ? <span className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-rose-600 text-[10px] font-black text-white">{unread}</span> : null}</Link>
        <div className="relative"><button type="button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100"><span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">{seller.initials}</span><span className="hidden text-left sm:block"><span className="block text-xs font-black text-slate-900">{seller.storeName}</span><span className="block text-[10px] text-slate-500">Seller</span></span></button>{profileOpen ? <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><Link href="/seller/store" className="block rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Store profile</Link><Link href="/seller/settings" className="block rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Settings</Link><button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50">Logout (placeholder)</button></div> : null}</div>
      </div>
    </header>
  );
}
