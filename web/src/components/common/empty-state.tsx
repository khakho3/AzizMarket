import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center sm:py-20">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
        {icon}
      </span>
      <h2 className="mt-6 text-2xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      <Link href={actionHref} className="mt-7 inline-flex rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-800">
        {actionLabel}
      </Link>
    </div>
  );
}
