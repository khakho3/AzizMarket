import type { ReactNode } from "react";

export function DashboardStatCard({ label, value, note, icon }: { label: string; value: string; note?: string; icon?: ReactNode }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p>{icon ? <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">{icon}</span> : null}</div><p className="mt-3 text-2xl font-black text-slate-950">{value}</p>{note ? <p className="mt-2 text-xs font-semibold text-slate-400">{note}</p> : null}</article>;
}
