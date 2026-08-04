"use client";

import { useEffect, useId, useState } from "react";

const defaultNote = "Seller information reviewed and approved.";

export function VerifySellerModal({
  sellerName,
  storeName,
  submitting,
  error,
  onClose,
  onConfirm,
}: {
  sellerName: string;
  storeName: string | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: (note: string | null) => void;
}) {
  const [note, setNote] = useState(defaultNote);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, submitting]);

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={submitting}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          Seller review
        </p>
        <h2 id={titleId} className="mt-2 text-2xl font-black text-slate-950">
          Verify seller
        </h2>
        <p id={descriptionId} className="mt-3 text-sm leading-6 text-slate-600">
          Confirm that <strong>{sellerName}</strong> and{" "}
          <strong>{storeName || "their store"}</strong> have been reviewed. The
          store will become active immediately.
        </p>
        <label className="mt-5 block text-sm font-bold text-slate-800">
          Approval note <span className="font-normal text-slate-400">(optional)</span>
          <textarea
            autoFocus
            rows={4}
            maxLength={500}
            value={note}
            disabled={submitting}
            onChange={(event) => setNote(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
          />
        </label>
        {error ? (
          <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onConfirm(note.trim() || null)}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify seller"}
          </button>
        </div>
      </div>
    </div>
  );
}
