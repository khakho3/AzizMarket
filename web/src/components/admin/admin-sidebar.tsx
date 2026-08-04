"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseIcon } from "@/components/common/icons";

const items = [
  ["/admin", "Overview", "▦"], ["/admin/orders", "Orders", "▤"], ["/admin/products", "Products", "□"], ["/admin/categories", "Categories", "◫"], ["/admin/sellers", "Sellers", "♙"], ["/admin/buyers", "Buyers", "♟"], ["/admin/payments", "Payments", "₵"], ["/admin/commissions", "Commissions", "%"], ["/admin/withdrawals", "Withdrawals", "↗"], ["/admin/disputes", "Disputes", "!"], ["/admin/messages", "Messages", "◌"], ["/admin/reports", "Reports", "⌁"], ["/admin/settings", "Settings", "⚙"],
] as const;

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return <>{open ? <button type="button" className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden" onClick={onClose} aria-label="Close admin navigation" /> : null}<aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white transition-transform lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:w-64 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-18 items-center justify-between border-b border-white/10 px-5"><Link href="/admin" className="text-xl font-black">Aziz<span className="text-amber-400">Market</span></Link><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-lg hover:bg-white/10 lg:hidden" aria-label="Close menu"><CloseIcon /></button></div><div className="border-b border-white/10 px-5 py-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Administration</p><p className="mt-2 text-sm text-slate-400">Marketplace operations</p></div><nav className="flex-1 space-y-1 overflow-y-auto p-3">{items.map(([href, label, icon]) => { const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><span className="grid size-5 place-items-center text-sm" aria-hidden="true">{icon}</span>{label}</Link>; })}</nav><div className="border-t border-white/10 p-3"><Link href="/" className="block rounded-xl px-3 py-3 text-sm font-bold text-amber-300 hover:bg-white/10">← Back to Marketplace</Link></div></aside></>;
}
