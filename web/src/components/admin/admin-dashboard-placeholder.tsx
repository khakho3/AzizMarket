import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { MenuIcon, PackageIcon, ShieldIcon, StoreIcon } from "@/components/common/icons";
import { formatCurrency } from "@/utils/format-currency";

const stats = [
  { label: "Gross marketplace value", value: formatCurrency(248650), trend: "+18.2%" },
  { label: "Active sellers", value: "164", trend: "+12 this month" },
  { label: "Total products", value: "1,284", trend: "+86 this month" },
  { label: "Open reviews", value: "17", trend: "Requires attention" },
];

export function AdminDashboardPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo inverse />
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden text-sm font-bold text-slate-300 hover:text-amber-300 sm:block">View marketplace</Link>
            <span className="grid size-10 place-items-center rounded-full bg-amber-400 text-sm font-black text-slate-950">AD</span>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[100rem] lg:grid-cols-[15rem_1fr]">
        <aside className="hidden min-h-[calc(100vh-4.5rem)] bg-slate-900 p-5 text-white lg:block">
          <p className="px-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Administration</p>
          <nav className="mt-5 space-y-1">
            <Link href="/admin" className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold text-amber-300"><ShieldIcon className="size-4" />Overview</Link>
            <Link href="/admin/categories" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-400 hover:bg-white/5"><StoreIcon className="size-4" />Categories</Link>
            <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-400"><PackageIcon className="size-4" />Products</span>
          </nav>
        </aside>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-emerald-700">Platform operations</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Admin dashboard</h1>
              <p className="mt-2 text-sm text-slate-500">Marketplace health and operational overview.</p>
            </div>
            <button type="button" className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white lg:hidden" aria-label="Open dashboard navigation"><MenuIcon /></button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-3 text-2xl font-black text-slate-950">{stat.value}</p>
                <p className={`mt-2 text-xs font-semibold ${stat.label === "Open reviews" ? "text-amber-700" : "text-emerald-700"}`}>{stat.trend}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between"><h2 className="font-black text-slate-950">Marketplace activity</h2><select aria-label="Activity time range" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"><option>Last 30 days</option></select></div>
              <div className="mt-8 flex h-56 items-end gap-3 border-b border-l border-slate-200 px-3 pt-4">
                {[42, 54, 38, 68, 61, 78, 72, 88, 81, 96, 90, 100].map((height, index) => (
                  <div key={`${height}-${index}`} className="flex-1 rounded-t-md bg-emerald-600/80" style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase text-slate-400"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-black text-slate-950">Needs attention</h2>
              <div className="mt-5 space-y-3">
                {[ ["8", "Seller applications", "Review new store requests"], ["17", "Flagged listings", "Check policy and quality flags"], ["5", "Open disputes", "Respond to buyer cases"] ].map(([count, title, description]) => (
                  <div key={title} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-sm font-black text-amber-800">{count}</span>
                    <div><p className="text-sm font-extrabold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
