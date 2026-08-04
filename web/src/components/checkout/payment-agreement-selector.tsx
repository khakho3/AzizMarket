"use client";

import { CheckIcon, PaymentIcon } from "@/components/common/icons";
import type { PaymentAgreement } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

interface PaymentAgreementSelectorProps {
  available: PaymentAgreement[];
  value: PaymentAgreement;
  amountPayableNow: number;
  remainingBalance: number;
  depositPercentage: number;
  onChange: (value: PaymentAgreement) => void;
}

export function PaymentAgreementSelector({ available, value, amountPayableNow, remainingBalance, depositPercentage, onChange }: PaymentAgreementSelectorProps) {
  return (
    <div>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Choose a payment agreement</legend>
        {available.map((agreement) => (
          <label key={agreement} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${value === agreement ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:border-emerald-300"}`}>
            <input type="radio" name="payment-agreement" checked={value === agreement} onChange={() => onChange(agreement)} className="sr-only" />
            <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${value === agreement ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"}`}>{value === agreement ? <CheckIcon className="size-4" /> : <PaymentIcon className="size-4" />}</span>
            <strong className="text-sm text-slate-900">{agreement}</strong>
          </label>
        ))}
      </fieldset>

      {value === "Partial Payment" ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-black">{depositPercentage}% deposit: {formatCurrency(amountPayableNow)} payable now</p>
          <p className="mt-1 leading-6">Remaining balance: <strong>{formatCurrency(remainingBalance)}</strong>. Pay the balance before seller dispatch.</p>
        </div>
      ) : null}
      {value === "Pre-order" ? (
        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
          Expected availability is within 7–14 business days. You may cancel for a full refund before the seller begins fulfilment.
        </div>
      ) : null}
      {value === "Payment on Delivery" ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Delivery fees and platform commitment charges are payable before dispatch. The product balance is collected on delivery.
        </div>
      ) : null}
    </div>
  );
}
