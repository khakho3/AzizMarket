"use client";

import { CheckIcon, CloseIcon } from "@/components/common/icons";

export interface ToastMessage {
  id: number;
  message: string;
  tone: "success" | "warning";
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-[120] flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl sm:right-6 sm:top-6 ${
        toast.tone === "success"
          ? "border-emerald-200 bg-white text-emerald-900"
          : "border-amber-200 bg-amber-50 text-amber-950"
      }`}
    >
      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${toast.tone === "success" ? "bg-emerald-100 text-emerald-700" : "bg-amber-200 text-amber-800"}`}>
        <CheckIcon className="size-4" />
      </span>
      <p className="pt-1 text-sm font-bold leading-5">{toast.message}</p>
      <button type="button" onClick={onDismiss} className="grid size-7 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss notification">
        <CloseIcon className="size-4" />
      </button>
    </div>
  );
}
