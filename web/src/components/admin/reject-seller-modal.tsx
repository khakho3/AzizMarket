"use client";

import { useEffect, useId, useState } from "react";

export function RejectSellerModal({
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
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, submitting]);

  function submit() {
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 10) {
      setFieldError("Enter a meaningful rejection reason of at least 10 characters.");
      return;
    }
    setFieldError(null);
    onConfirm(trimmedReason);
  }

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
        <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">
          Seller review
        </p>
        <h2 id={titleId} className="mt-2 text-2xl font-black text-slate-950">
          Reject seller
        </h2>
        <p id={descriptionId} className="mt-3 text-sm leading-6 text-slate-600">
          Explain why <strong>{sellerName}</strong> and{" "}
          <strong>{storeName || "their store"}</strong> could not be verified.
          Their store will remain inactive.
        </p>
        <label className="mt-5 block text-sm font-bold text-slate-800">
          Rejection reason
          <textarea
            autoFocus
            required
            rows={5}
            minLength={10}
            maxLength={500}
            value={reason}
            disabled={submitting}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? errorId : undefined}
            onChange={(event) => {
              setReason(event.target.value);
              if (fieldError) setFieldError(null);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 disabled:bg-slate-50"
            placeholder="Describe what information could not be verified."
          />
        </label>
        {fieldError ? (
          <p id={errorId} className="mt-2 text-sm font-bold text-rose-700">
            {fieldError}
          </p>
        ) : null}
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
            onClick={submit}
            className="rounded-xl bg-rose-700 px-5 py-3 text-sm font-black text-white hover:bg-rose-800 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Rejecting..." : "Reject seller"}
          </button>
        </div>
      </div>
    </div>
  );
}
