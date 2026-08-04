import Link from "next/link";
import { Container } from "@/components/common/container";
import { MarketplaceSearch } from "@/components/marketplace/marketplace-search";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-emerald-950 text-white">
      <div className="absolute -left-24 top-16 size-72 rounded-full bg-emerald-700/25 blur-3xl" />
      <div className="absolute -right-20 -top-20 size-80 rounded-full bg-amber-400/15 blur-3xl" />
      <Container className="relative grid min-h-[36rem] items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-emerald-700 bg-emerald-900/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            Ghana&apos;s local online marketplace
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Everything you need,
            <span className="block text-amber-400">from sellers you trust.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-100/85 sm:text-lg">
            Discover great products from verified businesses and independent
            sellers across Ghana. Compare, chat and shop with confidence.
          </p>
          <div className="mt-8 max-w-2xl">
            <MarketplaceSearch />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-emerald-200">
            <span className="font-semibold text-white">Popular:</span>
            <Link href="/products?q=phones" className="hover:text-amber-300">
              Phones
            </Link>
            <Link href="/products?q=fashion" className="hover:text-amber-300">
              Fashion
            </Link>
            <Link href="/products?q=furniture" className="hover:text-amber-300">
              Furniture
            </Link>
            <Link href="/products?q=beauty" className="hover:text-amber-300">
              Beauty
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-[28rem] lg:block" aria-hidden="true">
          <div className="absolute inset-x-8 top-5 rotate-3 rounded-[2rem] border border-white/10 bg-emerald-900/80 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  Marketplace today
                </p>
                <p className="mt-2 text-3xl font-black">1,280+ products</p>
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-amber-400 text-xl font-black text-slate-950">
                A
              </span>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["160+", "Sellers"],
                ["10", "Regions"],
                ["4.8/5", "Rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/8 p-4">
                  <p className="font-extrabold text-amber-300">{value}</p>
                  <p className="mt-1 text-xs text-emerald-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-3 left-0 w-72 -rotate-3 rounded-3xl bg-white p-5 text-slate-900 shadow-2xl shadow-black/30">
            <div className="h-28 rounded-2xl bg-gradient-to-br from-amber-100 via-emerald-50 to-emerald-200" />
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-700">Featured locally</p>
                <p className="mt-1 font-extrabold">Quality picks, every day</p>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                Shop
              </span>
            </div>
          </div>
          <div className="absolute bottom-10 right-0 w-56 rotate-6 rounded-3xl border border-white/20 bg-amber-400 p-6 text-slate-950 shadow-xl">
            <p className="text-sm font-extrabold">Pay your way</p>
            <p className="mt-2 text-xs leading-5 text-slate-800">
              Mobile Money, cards, bank transfer or cash on delivery.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
