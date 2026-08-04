import type { ReactNode } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { ShieldIcon, StoreIcon, TruckIcon } from "@/components/common/icons";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-emerald-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-amber-400/15 blur-2xl" />
          <BrandLogo inverse />
          <div className="relative my-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              One marketplace. More possibilities.
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight">
              Shop local, connect directly and buy confidently.
            </h2>
            <div className="mt-10 space-y-5 text-sm text-emerald-100">
              <p className="flex items-center gap-3"><ShieldIcon className="size-5 text-amber-300" /> Trusted Ghanaian sellers</p>
              <p className="flex items-center gap-3"><TruckIcon className="size-5 text-amber-300" /> Flexible delivery choices</p>
              <p className="flex items-center gap-3"><StoreIcon className="size-5 text-amber-300" /> Direct seller conversations</p>
            </div>
          </div>
          <p className="text-xs text-emerald-300">Secure access for buyers, sellers and admins.</p>
        </div>
        <div className="p-6 sm:p-10 lg:p-14">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
