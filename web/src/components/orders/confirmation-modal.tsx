"use client";

import { CloseIcon } from "@/components/common/icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmationModal({ isOpen, title, description, confirmLabel, onConfirm, onClose }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-description" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><h2 id="confirmation-title" className="text-xl font-black text-slate-950">{title}</h2><p id="confirmation-description" className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div><button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100" aria-label="Close confirmation"><CloseIcon className="size-4" /></button></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-700">Keep Order</button><button type="button" onClick={onConfirm} className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-rose-700">{confirmLabel}</button></div>
      </section>
    </div>
  );
}
