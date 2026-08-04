"use client";

import { useState } from "react";

export function AdminActionModal({ open, title, description, confirmLabel, requireReason = true, tone = "default", onClose, onConfirm }: { open: boolean; title: string; description: string; confirmLabel: string; requireReason?: boolean; tone?: "default" | "danger"; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  if (!open) return null;
  return <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-labelledby="admin-action-title"><form onSubmit={(event) => { event.preventDefault(); if (!requireReason || reason.trim()) { onConfirm(reason.trim()); setReason(""); } }} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><h2 id="admin-action-title" className="text-2xl font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>{requireReason ? <label className="mt-5 block text-sm font-bold">Admin reason<textarea required rows={4} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label> : null}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold">Cancel</button><button type="submit" className={`rounded-xl px-5 py-3 text-sm font-black text-white ${tone === "danger" ? "bg-rose-700" : "bg-emerald-700"}`}>{confirmLabel}</button></div></form></div>;
}
