"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MenuIcon, SearchIcon } from "@/components/common/icons";
import { useAdmin } from "@/context/admin-context";

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const { admin } = useAdmin();
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  return <header className="sticky top-0 z-30 flex h-18 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"><button type="button" onClick={onMenu} className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 lg:hidden" aria-label="Open admin navigation"><MenuIcon /></button><form onSubmit={(event) => { event.preventDefault(); if (query.trim()) router.push(`/admin/orders?search=${encodeURIComponent(query.trim())}`); }} className="relative max-w-xl flex-1"><label htmlFor="admin-global-search" className="sr-only">Search orders</label><SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input id="admin-global-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders, buyers or sellers" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500" /></form><button type="button" className="relative grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Admin notifications"><span aria-hidden="true">🔔</span><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500" /></button><div className="relative"><button type="button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100"><span className="grid size-9 place-items-center rounded-full bg-amber-400 text-xs font-black text-slate-950">{admin.initials}</span><span className="hidden text-left sm:block"><span className="block text-xs font-black">{admin.name}</span><span className="block text-[10px] text-slate-500">Administrator</span></span></button>{profileOpen ? <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><p className="px-3 py-2 text-xs text-slate-500">{admin.email}</p><button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50">Logout (placeholder)</button></div> : null}</div></header>;
}
