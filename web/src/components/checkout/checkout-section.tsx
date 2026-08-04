import type { ReactNode } from "react";

interface CheckoutSectionProps {
  number: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export function CheckoutSection({ number, title, description, children }: CheckoutSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-black text-white">{number}</span>
        <div><h2 className="text-lg font-black text-slate-950">{title}</h2>{description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}</div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
