import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/common/auth-shell";
import { ArrowRightIcon, CartIcon, StoreIcon } from "@/components/common/icons";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Choose how you want to join AzizMarket.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join the marketplace"
      title="How would you like to use AzizMarket?"
      description="Choose the account that matches what you want to do."
    >
      <div className="grid gap-4">
        <Link
          href="/register/buyer"
          className="group rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition hover:border-emerald-400 hover:bg-emerald-100"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white">
              <CartIcon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-black text-slate-950">Register as Buyer</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                Browse products, communicate with sellers and place orders.
              </span>
            </span>
            <ArrowRightIcon className="mt-3 size-5 shrink-0 text-emerald-700 transition group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/register/seller"
          className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-amber-300 hover:bg-amber-50"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-400 text-slate-950">
              <StoreIcon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-black text-slate-950">Register as Seller</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                Create a store, upload products and manage orders.
              </span>
            </span>
            <ArrowRightIcon className="mt-3 size-5 shrink-0 text-amber-700 transition group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-extrabold text-emerald-700 hover:text-emerald-800">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
