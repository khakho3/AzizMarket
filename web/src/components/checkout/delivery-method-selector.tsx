"use client";

import { CheckIcon, TruckIcon } from "@/components/common/icons";
import { deliveryMethods } from "@/data/checkout";
import type { DeliveryMethodId } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

interface DeliveryMethodSelectorProps {
  value: DeliveryMethodId;
  onChange: (value: DeliveryMethodId) => void;
  isLocalDelivery: boolean;
  buyerCity: string;
}

export function DeliveryMethodSelector({ value, onChange, isLocalDelivery, buyerCity }: DeliveryMethodSelectorProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Choose a delivery method</legend>
      {isLocalDelivery ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          Free local delivery applied because every seller in this order is located in {buyerCity}.
        </p>
      ) : null}
      {deliveryMethods.map((method) => {
        const displayedPrice = method.id === "pickup" || isLocalDelivery ? 0 : method.price;
        return (
          <label key={method.id} className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${value === method.id ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:border-emerald-300"}`}>
            <input type="radio" name="delivery-method" value={method.id} checked={value === method.id} onChange={() => onChange(method.id)} className="sr-only" />
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${value === method.id ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"}`}>{value === method.id ? <CheckIcon className="size-5" /> : <TruckIcon className="size-5" />}</span>
            <span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">{method.name}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{method.description}</span><span className="mt-2 block text-xs font-bold text-emerald-700">{method.estimatedPeriod}</span></span>
            <strong className="shrink-0 text-sm text-slate-900">{displayedPrice ? formatCurrency(displayedPrice) : "Free"}</strong>
          </label>
        );
      })}
    </fieldset>
  );
}
