"use client";

import { MinusIcon, PlusIcon } from "@/components/common/icons";

interface QuantitySelectorProps {
  quantity: number;
  maximum: number;
  onChange: (quantity: number) => void;
  compact?: boolean;
}

export function QuantitySelector({
  quantity,
  maximum,
  onChange,
  compact = false,
}: QuantitySelectorProps) {
  const buttonSize = compact ? "size-9" : "size-11";

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className={`grid ${buttonSize} place-items-center text-slate-600 disabled:cursor-not-allowed disabled:opacity-35`}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="size-4" />
      </button>
      <output className="w-9 text-center text-sm font-black" aria-live="polite">
        {quantity}
      </output>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= maximum}
        className={`grid ${buttonSize} place-items-center text-slate-600 disabled:cursor-not-allowed disabled:opacity-35`}
        aria-label="Increase quantity"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
