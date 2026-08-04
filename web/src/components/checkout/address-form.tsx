"use client";

import { ghanaLocations } from "@/data/checkout";
import type { DeliveryAddress } from "@/types";

interface AddressFormProps {
  address: DeliveryAddress;
  onChange: (address: DeliveryAddress) => void;
}

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";

export function AddressForm({ address, onChange }: AddressFormProps) {
  const cities = address.region ? ghanaLocations[address.region] ?? [] : [];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="delivery-region" className="text-sm font-bold text-slate-800">Region</label>
        <select id="delivery-region" required value={address.region} onChange={(event) => onChange({ ...address, region: event.target.value, city: "" })} className={`${inputClass} bg-white`}>
          <option value="">Select region</option>
          {Object.keys(ghanaLocations).map((region) => <option key={region} value={region}>{region}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="delivery-city" className="text-sm font-bold text-slate-800">City or town</label>
        <select id="delivery-city" required value={address.city} onChange={(event) => onChange({ ...address, city: event.target.value })} disabled={!address.region} className={`${inputClass} bg-white disabled:bg-slate-100`}>
          <option value="">Select city or town</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="delivery-area" className="text-sm font-bold text-slate-800">Area</label>
        <input id="delivery-area" required value={address.area} onChange={(event) => onChange({ ...address, area: event.target.value })} placeholder="e.g. East Legon" className={inputClass} />
      </div>
      <div>
        <label htmlFor="delivery-street" className="text-sm font-bold text-slate-800">Street or landmark</label>
        <input id="delivery-street" required value={address.street} onChange={(event) => onChange({ ...address, street: event.target.value })} placeholder="Street, house number or landmark" className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="delivery-instructions" className="text-sm font-bold text-slate-800">Additional delivery instructions <span className="font-normal text-slate-400">(optional)</span></label>
        <textarea id="delivery-instructions" rows={3} value={address.instructions} onChange={(event) => onChange({ ...address, instructions: event.target.value })} placeholder="Gate colour, directions or preferred contact instructions" className={`${inputClass} resize-none`} />
      </div>
    </div>
  );
}
