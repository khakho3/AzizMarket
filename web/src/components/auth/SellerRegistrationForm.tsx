"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/auth-context";
import { ghanaRegions } from "@/data/ghana-regions";
import type {
  SellerRegistrationFieldErrors,
  SellerRegistrationFormData,
} from "@/types/auth";

const initialFormData: SellerRegistrationFormData = {
  fullName: "",
  email: "",
  phone: "",
  storeName: "",
  storeDescription: "",
  region: "",
  city: "",
  address: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";

function validateRegistration(
  data: SellerRegistrationFormData,
): SellerRegistrationFieldErrors {
  const errors: SellerRegistrationFieldErrors = {};
  const fullName = data.fullName.trim();
  const email = data.email.trim();
  const phone = data.phone.trim();
  const storeName = data.storeName.trim();
  const city = data.city.trim();

  if (!fullName) errors.fullName = "Enter your full name.";
  else if (fullName.length < 2 || fullName.length > 160) {
    errors.fullName = "Full name must contain between 2 and 160 characters.";
  }

  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone) errors.phone = "Enter your phone number.";
  else if (phone.length < 7 || phone.length > 32) {
    errors.phone = "Phone number must contain between 7 and 32 characters.";
  }

  if (!storeName) errors.storeName = "Enter your store name.";
  else if (storeName.length < 2 || storeName.length > 180) {
    errors.storeName = "Store name must contain between 2 and 180 characters.";
  }

  if (data.storeDescription.trim().length > 5000) {
    errors.storeDescription = "Store description must contain 5,000 characters or fewer.";
  }
  if (!data.region) errors.region = "Select your store region.";
  if (!city) errors.city = "Enter your city or town.";
  else if (city.length < 2 || city.length > 100) {
    errors.city = "City or town must contain between 2 and 100 characters.";
  }
  if (data.address.trim().length > 1000) {
    errors.address = "Store address must contain 1,000 characters or fewer.";
  }

  if (data.password.length < 8) {
    errors.password = "Password must contain at least 8 characters.";
  } else if (data.password.length > 128) {
    errors.password = "Password must contain 128 characters or fewer.";
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match.";
  }
  if (!data.acceptedTerms) {
    errors.acceptedTerms = "You must accept the terms and conditions.";
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-2 text-xs font-bold text-rose-700">
      {message}
    </p>
  ) : null;
}

export function SellerRegistrationForm() {
  const router = useRouter();
  const { registerSeller } = useAuth();
  const [formData, setFormData] =
    useState<SellerRegistrationFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] =
    useState<SellerRegistrationFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof SellerRegistrationFormData>(
    field: Key,
    value: SellerRegistrationFormData[Key],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const errors = validateRegistration(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please correct the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      await registerSeller({
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
        store_name: formData.storeName.trim(),
        store_description: formData.storeDescription.trim() || null,
        region: formData.region,
        city: formData.city.trim(),
        address: formData.address.trim() || null,
      });
      router.replace("/seller?registration=success");
    } catch (registrationError) {
      setFormError(
        registrationError instanceof Error
          ? registrationError.message
          : "Unable to create your seller account. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <p
          id="seller-registration-error"
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-800"
        >
          {formError}
        </p>
      ) : null}

      <fieldset className="rounded-2xl border border-slate-200 p-5">
        <legend className="px-2 text-base font-black text-slate-950">1. Personal information</legend>
        <div className="mt-2 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="seller-full-name" className="text-sm font-bold text-slate-800">Full name</label>
            <input id="seller-full-name" name="fullName" autoComplete="name" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} aria-invalid={Boolean(fieldErrors.fullName)} aria-describedby={fieldErrors.fullName ? "seller-full-name-error" : undefined} placeholder="Seller Name" className={inputClass} />
            <FieldError id="seller-full-name-error" message={fieldErrors.fullName} />
          </div>
          <div>
            <label htmlFor="seller-email" className="text-sm font-bold text-slate-800">Email address</label>
            <input id="seller-email" name="email" type="email" autoComplete="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "seller-email-error" : undefined} placeholder="seller@example.com" className={inputClass} />
            <FieldError id="seller-email-error" message={fieldErrors.email} />
          </div>
          <div>
            <label htmlFor="seller-phone" className="text-sm font-bold text-slate-800">Phone number</label>
            <input id="seller-phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "seller-phone-error" : undefined} placeholder="0250000000" className={inputClass} />
            <FieldError id="seller-phone-error" message={fieldErrors.phone} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 p-5">
        <legend className="px-2 text-base font-black text-slate-950">2. Store information</legend>
        <div className="mt-2 grid gap-5">
          <div>
            <label htmlFor="seller-store-name" className="text-sm font-bold text-slate-800">Store name</label>
            <input id="seller-store-name" name="storeName" autoComplete="organization" value={formData.storeName} onChange={(event) => updateField("storeName", event.target.value)} aria-invalid={Boolean(fieldErrors.storeName)} aria-describedby={fieldErrors.storeName ? "seller-store-name-error" : undefined} placeholder="Seller Store" className={inputClass} />
            <FieldError id="seller-store-name-error" message={fieldErrors.storeName} />
          </div>
          <div>
            <label htmlFor="seller-store-description" className="text-sm font-bold text-slate-800">Store description <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea id="seller-store-description" name="storeDescription" rows={4} value={formData.storeDescription} onChange={(event) => updateField("storeDescription", event.target.value)} aria-invalid={Boolean(fieldErrors.storeDescription)} aria-describedby={fieldErrors.storeDescription ? "seller-store-description-error" : undefined} placeholder="Tell buyers what your store offers" className={inputClass} />
            <FieldError id="seller-store-description-error" message={fieldErrors.storeDescription} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 p-5">
        <legend className="px-2 text-base font-black text-slate-950">3. Location</legend>
        <div className="mt-2 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="seller-region" className="text-sm font-bold text-slate-800">Region</label>
            <select id="seller-region" name="region" value={formData.region} onChange={(event) => updateField("region", event.target.value)} aria-invalid={Boolean(fieldErrors.region)} aria-describedby={fieldErrors.region ? "seller-region-error" : undefined} className={inputClass}>
              <option value="">Select a region</option>
              {ghanaRegions.map((region) => <option key={region} value={region}>{region}</option>)}
            </select>
            <FieldError id="seller-region-error" message={fieldErrors.region} />
          </div>
          <div>
            <label htmlFor="seller-city" className="text-sm font-bold text-slate-800">City or town</label>
            <input id="seller-city" name="city" autoComplete="address-level2" value={formData.city} onChange={(event) => updateField("city", event.target.value)} aria-invalid={Boolean(fieldErrors.city)} aria-describedby={fieldErrors.city ? "seller-city-error" : undefined} placeholder="Tema" className={inputClass} />
            <FieldError id="seller-city-error" message={fieldErrors.city} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="seller-address" className="text-sm font-bold text-slate-800">Store address <span className="font-normal text-slate-400">(optional)</span></label>
            <input id="seller-address" name="address" autoComplete="street-address" value={formData.address} onChange={(event) => updateField("address", event.target.value)} aria-invalid={Boolean(fieldErrors.address)} aria-describedby={fieldErrors.address ? "seller-address-error" : undefined} placeholder="Community 1, Tema" className={inputClass} />
            <FieldError id="seller-address-error" message={fieldErrors.address} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 p-5">
        <legend className="px-2 text-base font-black text-slate-950">4. Account security</legend>
        <div className="mt-2 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="seller-password" className="text-sm font-bold text-slate-800">Password</label>
            <div className="relative">
              <input id="seller-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={formData.password} onChange={(event) => updateField("password", event.target.value)} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "seller-password-error" : undefined} placeholder="At least 8 characters" className={`${inputClass} pr-20`} />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50">{showPassword ? "Hide" : "Show"}</button>
            </div>
            <FieldError id="seller-password-error" message={fieldErrors.password} />
          </div>
          <div>
            <label htmlFor="seller-confirm-password" className="text-sm font-bold text-slate-800">Confirm password</label>
            <div className="relative">
              <input id="seller-confirm-password" name="confirmPassword" type={showConfirmation ? "text" : "password"} autoComplete="new-password" value={formData.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} aria-invalid={Boolean(fieldErrors.confirmPassword)} aria-describedby={fieldErrors.confirmPassword ? "seller-confirm-password-error" : undefined} placeholder="Repeat your password" className={`${inputClass} pr-20`} />
              <button type="button" onClick={() => setShowConfirmation((visible) => !visible)} aria-label={showConfirmation ? "Hide password confirmation" : "Show password confirmation"} aria-pressed={showConfirmation} className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50">{showConfirmation ? "Hide" : "Show"}</button>
            </div>
            <FieldError id="seller-confirm-password-error" message={fieldErrors.confirmPassword} />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-start gap-3 text-xs leading-5 text-slate-600">
              <input type="checkbox" checked={formData.acceptedTerms} onChange={(event) => updateField("acceptedTerms", event.target.checked)} aria-invalid={Boolean(fieldErrors.acceptedTerms)} aria-describedby={fieldErrors.acceptedTerms ? "seller-terms-error" : undefined} className="mt-0.5 size-4 rounded border-slate-300 accent-emerald-700" />
              <span>I agree to the marketplace terms and conditions, seller rules and privacy policy.</span>
            </label>
            <FieldError id="seller-terms-error" message={fieldErrors.acceptedTerms} />
          </div>
        </div>
      </fieldset>

      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="w-full rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-500">
        {isSubmitting ? "Creating seller account..." : "Create Seller Account"}
      </button>

      <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-slate-500 sm:flex-row sm:gap-5">
        <Link href="/register/buyer" className="font-extrabold text-emerald-700 hover:text-emerald-800">Register as a buyer</Link>
        <span className="hidden text-slate-300 sm:inline">|</span>
        <span>Already registered? <Link href="/login" className="font-extrabold text-emerald-700 hover:text-emerald-800">Login</Link></span>
      </div>
    </form>
  );
}
