import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { MenuIcon, MessageIcon, PackageIcon, StoreIcon } from "@/components/common/icons";
import { formatCurrency } from "@/utils/format-currency";

const stats = [
  { label: "Total sales", value: formatCurrency(18420), note: "+12.5% this month" },
  { label: "Orders", value: "128", note: "9 awaiting action" },
  { label: "Products", value: "36", note: "31 currently active" },
  { label: "Store rating", value: "4.8", note: "From 94 reviews" },
];

export function SellerDashboardPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm font-bold text-slate-600 hover:text-emerald-700 sm:block">View marketplace</Link>
            <span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">KS</span>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[100rem] lg:grid-cols-[15rem_1fr]">
        <aside className="hidden min-h-[calc(100vh-4.5rem)] border-r border-slate-200 bg-white p-5 lg:block">
          <p className="px-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Seller workspace</p>
          <nav className="mt-5 space-y-1">
            <Link href="/seller" className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-800"><StoreIcon className="size-4" />Overview</Link>
            <Link href="/seller/products" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"><PackageIcon className="size-4" />Products</Link>
            <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-600"><PackageIcon className="size-4" />Orders</span>
            <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-600"><MessageIcon className="size-4" />Messages</span>
          </nav>
        </aside>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-emerald-700">Kumasi Crafts Co.</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Seller dashboard</h1>
              <p className="mt-2 text-sm text-slate-500">Here&apos;s a snapshot of your store performance.</p>
            </div>
            <button type="button" className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white lg:hidden" aria-label="Open dashboard navigation"><MenuIcon /></button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-3 text-2xl font-black text-slate-950">{stat.value}</p>
                <p className="mt-2 text-xs font-semibold text-emerald-700">{stat.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <h2 className="font-black text-slate-950">Recent orders</h2>
                <span className="text-xs font-bold text-emerald-700">View all</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-lg text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {[["#SM-1048", "Adwoa K.", "GH₵640.00", "Processing"], ["#SM-1047", "Kwame B.", "GH₵320.00", "Shipped"], ["#SM-1046", "Esi A.", "GH₵960.00", "Delivered"]].map((order) => (
                      <tr key={order[0]}><td className="px-5 py-4 font-bold text-slate-900">{order[0]}</td><td className="px-5 py-4 text-slate-600">{order[1]}</td><td className="px-5 py-4 font-bold">{order[2]}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{order[3]}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="rounded-2xl bg-emerald-950 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Quick start</p>
              <h2 className="mt-3 text-xl font-black">Your store is looking good.</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-100">Add another product or respond to open buyer messages to keep growing.</p>
              <Link href="/seller/products/new" className="mt-6 inline-flex rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-slate-950">Add product</Link>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
