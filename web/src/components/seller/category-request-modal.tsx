"use client";

import { useState } from "react";
import { currentSeller } from "@/data/current-seller";
import type { CategoryRequest } from "@/types";

const storageKey = "azizmarket-category-requests";

interface CategoryRequestModalProps { open: boolean; onClose: () => void }

export function CategoryRequestModal({ open, onClose }: CategoryRequestModalProps) {
  const [suggestedName, setSuggestedName] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let existing: CategoryRequest[] = [];
    try {
      const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(value)) existing = value as CategoryRequest[];
    } catch {
      existing = [];
    }
    const request: CategoryRequest = { id: `category-request-${window.crypto.randomUUID()}`, sellerId: currentSeller.id, suggestedName, description, reason, createdAt: new Date().toISOString(), status: "Pending" };
    window.localStorage.setItem(storageKey, JSON.stringify([request, ...existing]));
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="category-request-title">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {submitted ? (
          <div className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-xl font-black text-emerald-700">✓</span><h2 id="category-request-title" className="mt-4 text-2xl font-black">Request submitted</h2><p className="mt-2 text-sm leading-6 text-slate-500">Your suggestion is stored for an administrator to review.</p><button type="button" onClick={onClose} className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Done</button></div>
        ) : (
          <form onSubmit={submit}>
            <h2 id="category-request-title" className="text-2xl font-black text-slate-950">Request New Category</h2>
            <p className="mt-2 text-sm text-slate-500">Tell the AzizMarket admin team what is missing.</p>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-slate-700">Suggested category name<input required value={suggestedName} onChange={(event) => setSuggestedName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="block text-sm font-bold text-slate-700">Description<textarea required rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
              <label className="block text-sm font-bold text-slate-700">Reason for request<textarea required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500" /></label>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Cancel</button><button type="submit" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Submit Request</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
