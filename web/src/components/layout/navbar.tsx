"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { Container } from "@/components/common/container";
import { CartIcon, MenuIcon, MessageIcon } from "@/components/common/icons";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import type { UserRole } from "@/types/auth";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Become a Seller", href: "/seller" },
];

const accountLinks = [
  { label: "Orders", href: "/orders" },
  { label: "Messages", href: "/login?next=/messages" },
];

const dashboardLinks: Record<UserRole, string> = {
  buyer: "/orders",
  seller: "/seller",
  admin: "/admin",
};

export function Navbar() {
  const { totalQuantity } = useCart();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <>
      <div className="bg-emerald-950 py-2 text-center text-xs font-medium text-emerald-50">
        <Container>
          Shop from trusted local sellers with delivery across Ghana
        </Container>
      </div>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <Container className="flex h-18 items-center justify-between gap-6">
          <BrandLogo />

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Main navigation">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            {accountLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
              aria-label="Shopping cart"
            >
              <CartIcon />
              {totalQuantity > 0 ? (
                <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-extrabold text-slate-950">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              ) : null}
            </Link>
            <span className="h-6 w-px bg-slate-200" />
            {isLoading ? (
              <span className="h-10 w-44 animate-pulse rounded-xl bg-slate-100" aria-label="Loading account" />
            ) : isAuthenticated && user ? (
              <>
                <div className="text-right leading-tight">
                  <p className="max-w-40 truncate text-sm font-extrabold text-slate-900">{user.full_name}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{user.role}</p>
                </div>
                <Link href={dashboardLinks[user.role]} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">Dashboard</Link>
                <button type="button" onClick={logout} className="text-sm font-bold text-rose-600 hover:text-rose-700">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-slate-800 transition hover:text-emerald-700">Login</Link>
                <Link href="/register" className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800">Sign Up</Link>
              </>
            )}
          </div>

          <details className="group relative xl:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-slate-200 text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open navigation menu</span>
              <MenuIcon />
            </summary>
            <div className="absolute right-0 top-13 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
              <nav className="grid" aria-label="Mobile navigation">
                {[...primaryLinks, ...accountLinks].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                >
                  <CartIcon className="size-5" /> Cart
                  {totalQuantity > 0 ? (
                    <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                      {totalQuantity}
                    </span>
                  ) : null}
                </Link>
                {!isLoading && isAuthenticated && user ? (
                  <div className="mt-2 grid gap-2 border-t border-slate-100 pt-3">
                    <div className="rounded-xl bg-emerald-50 px-4 py-3">
                      <p className="truncate text-sm font-extrabold text-slate-900">{user.full_name}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{user.role}</p>
                    </div>
                    <Link href={dashboardLinks[user.role]} className="rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white">Dashboard</Link>
                    <button type="button" onClick={logout} className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600">Logout</button>
                  </div>
                ) : !isLoading ? (
                  <>
                    <Link href="/login" className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800">Login</Link>
                    <Link href="/register" className="mt-2 rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white">Sign Up</Link>
                  </>
                ) : (
                  <span className="mt-2 h-12 animate-pulse rounded-xl bg-slate-100" aria-label="Loading account" />
                )}
              </nav>
              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 px-4 pt-3 text-xs text-slate-500">
                <MessageIcon className="size-4" /> Help is one message away
              </div>
            </div>
          </details>
        </Container>
      </header>
    </>
  );
}
