"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { CheckIcon, CloseIcon, MessageIcon } from "@/components/common/icons";

const suggestedMessage = "Hello, is this product still available?";

interface ChatModalProps {
  isOpen: boolean;
  productName: string;
  sellerName: string;
  onClose: () => void;
}

export function ChatModal({
  isOpen,
  productName,
  sellerName,
  onClose,
}: ChatModalProps) {
  const [message, setMessage] = useState(suggestedMessage);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  function closeModal() {
    setSent(false);
    setMessage(suggestedMessage);
    onClose();
  }

  function handleBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) closeModal();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;

    setSent(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setSent(false), 3000);
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-end bg-slate-950/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
      onMouseDown={handleBackdrop}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-modal-title"
        className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <MessageIcon />
            </span>
            <div>
              <h2 id="chat-modal-title" className="text-lg font-black text-slate-950">
                Chat with {sellerName}
              </h2>
              <p className="mt-1 text-xs text-slate-500">Replies are usually quick during business hours.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="grid size-9 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close chat"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
            Product being discussed
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-800">{productName}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="seller-message" className="text-sm font-bold text-slate-800">
            Your message
          </label>
          <textarea
            ref={inputRef}
            id="seller-message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSent(false);
            }}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100"
          />
          {sent ? (
            <p role="status" className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              <CheckIcon className="size-4" /> Message sent successfully.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={!message.trim()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <MessageIcon className="size-4" /> Send message
          </button>
        </form>
      </section>
    </div>
  );
}
