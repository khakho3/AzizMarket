"use client";

import type { PaymentAgreement, PaymentMethod } from "@/types";

export interface PaymentDetailsState {
  mobileNetwork: string;
  mobileNumber: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentMethodSelectorProps {
  agreement: PaymentAgreement;
  method: PaymentMethod;
  details: PaymentDetailsState;
  onMethodChange: (method: PaymentMethod) => void;
  onDetailsChange: (details: PaymentDetailsState) => void;
}

const fieldClass = "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";

export function PaymentMethodSelector({ agreement, method, details, onMethodChange, onDetailsChange }: PaymentMethodSelectorProps) {
  const methods: PaymentMethod[] = [
    "Mobile Money",
    "Card",
    "Bank Transfer",
    ...(agreement === "Payment on Delivery" ? (["Cash on Delivery"] as PaymentMethod[]) : []),
  ];

  return (
    <div>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Choose payment method</legend>
        {methods.map((option) => (
          <label key={option} className={`cursor-pointer rounded-xl border p-4 text-sm font-extrabold transition ${method === option ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-slate-200 text-slate-700 hover:border-emerald-300"}`}>
            <input type="radio" name="payment-method" checked={method === option} onChange={() => onMethodChange(option)} className="mr-3 accent-emerald-700" />{option}
          </label>
        ))}
      </fieldset>

      {method === "Mobile Money" ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="momo-network" className="text-sm font-bold text-slate-800">Network</label><select id="momo-network" required value={details.mobileNetwork} onChange={(event) => onDetailsChange({ ...details, mobileNetwork: event.target.value })} className={`${fieldClass} bg-white`}><option value="">Select network</option><option>MTN Mobile Money</option><option>Telecel Cash</option><option>AT Money</option></select></div>
          <div><label htmlFor="momo-number" className="text-sm font-bold text-slate-800">Phone number</label><input id="momo-number" type="tel" required value={details.mobileNumber} onChange={(event) => onDetailsChange({ ...details, mobileNumber: event.target.value })} placeholder="024 000 0000" className={fieldClass} /></div>
        </div>
      ) : null}

      {method === "Card" ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="cardholder-name" className="text-sm font-bold text-slate-800">Cardholder name</label><input id="cardholder-name" required value={details.cardholderName} onChange={(event) => onDetailsChange({ ...details, cardholderName: event.target.value })} placeholder="Name on card" className={fieldClass} /></div>
          <div className="sm:col-span-2"><label htmlFor="card-number" className="text-sm font-bold text-slate-800">Card number</label><input id="card-number" inputMode="numeric" required value={details.cardNumber} onChange={(event) => onDetailsChange({ ...details, cardNumber: event.target.value })} placeholder="0000 0000 0000 0000" className={fieldClass} /></div>
          <div><label htmlFor="card-expiry" className="text-sm font-bold text-slate-800">Expiry date</label><input id="card-expiry" required value={details.expiryDate} onChange={(event) => onDetailsChange({ ...details, expiryDate: event.target.value })} placeholder="MM/YY" className={fieldClass} /></div>
          <div><label htmlFor="card-cvv" className="text-sm font-bold text-slate-800">CVV</label><input id="card-cvv" inputMode="numeric" required value={details.cvv} onChange={(event) => onDetailsChange({ ...details, cvv: event.target.value })} placeholder="123" className={fieldClass} /></div>
        </div>
      ) : null}

      {method === "Bank Transfer" ? <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Mock bank details will be shown after placing the order. The order remains pending until the transfer is confirmed.</p> : null}
      {method === "Cash on Delivery" ? <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Pay the outstanding product balance to the courier. Delivery and platform fees remain payable now.</p> : null}

      <p className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs leading-5 text-sky-900">
        Frontend demonstration only. Do not enter real payment credentials—no payment information is processed or saved.
      </p>
    </div>
  );
}
