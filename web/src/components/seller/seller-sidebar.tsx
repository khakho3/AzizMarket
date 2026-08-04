"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseIcon, MessageIcon, PackageIcon, PaymentIcon, StoreIcon } from "@/components/common/icons";

const items = [
  { href: "/seller", label: "Overview", icon: StoreIcon, exact: true },
  { href: "/seller/products", label: "Products", icon: PackageIcon },
  { href: "/seller/products/new", label: "Add Product", icon: PackageIcon, exact: true },
  { href: "/seller/orders", label: "Orders", icon: PackageIcon },
  { href: "/seller/messages", label: "Messages", icon: MessageIcon },
  { href: "/seller/earnings", label: "Earnings", icon: PaymentIcon },
  { href: "/seller/store", label: "Store Profile", icon: StoreIcon },
  { href: "/seller/settings", label: "Settings", icon: StoreIcon },
];

export function SellerSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open ? <button type="button" className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" aria-label="Close seller navigation" onClick={onClose} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-emerald-950 text-white transition-transform lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:w-64 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-18 items-center justify-between border-b border-white/10 px-5"><Link href="/seller" className="text-xl font-black">Aziz<span className="text-amber-400">Market</span></Link><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-lg hover:bg-white/10 lg:hidden" aria-label="Close menu"><CloseIcon className="size-5" /></button></div>
        <div className="border-b border-white/10 px-5 py-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Seller workspace</p><p className="mt-2 font-black">Naya Threads</p><p className="mt-1 text-xs text-emerald-200">Verified store</p></div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">{items.map(({ href, label, icon: Icon, exact }) => { const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active ? "bg-white text-emerald-950" : "text-emerald-100 hover:bg-white/10 hover:text-white"}`}><Icon className="size-4" />{label}</Link>; })}</nav>
        <div className="border-t border-white/10 p-3"><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-amber-300 hover:bg-white/10">← Back to Marketplace</Link></div>
      </aside>
    </>
  );
}
