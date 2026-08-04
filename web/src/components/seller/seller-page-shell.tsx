import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { PackageIcon, StoreIcon } from "@/components/common/icons";

export function SellerPageShell({ children, active = "products" }: { children: ReactNode; active?: "overview" | "products" }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo />
          <div className="flex items-center gap-3"><Link href="/" className="text-sm font-bold text-slate-600 hover:text-emerald-700">View marketplace</Link><span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">NT</span></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[100rem] lg:grid-cols-[15rem_1fr]">
        <aside className="hidden min-h-[calc(100vh-4.5rem)] border-r border-slate-200 bg-white p-5 lg:block">
          <p className="px-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Seller workspace</p>
          <nav className="mt-5 space-y-1">
            <Link href="/seller" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${active === "overview" ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}><StoreIcon className="size-4" />Overview</Link>
            <Link href="/seller/products" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${active === "products" ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}><PackageIcon className="size-4" />Products</Link>
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
