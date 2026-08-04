"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/auth-context";
import type {
  BuyerRegistrationFormData,
  FieldErrors,
} from "@/types/auth";
import { getPermittedNextDestination } from "@/utils/auth-routes";

const initialFormData: BuyerRegistrationFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";

function validateRegistration(data: BuyerRegistrationFormData): FieldErrors {
  const errors: FieldErrors = {};
  const fullName = data.fullName.trim();
  const email = data.email.trim();
  const phone = data.phone.trim();

  if (!fullName) {
    errors.fullName = "Enter your full name.";
  } else if (fullName.length < 2) {
    errors.fullName = "Full name must contain at least 2 characters.";
  } else if (fullName.length > 160) {
    errors.fullName = "Full name must contain 160 characters or fewer.";
  }

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (phone.length > 32) {
    errors.phone = "Phone number must contain 32 characters or fewer.";
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

export function BuyerRegistrationForm() {
  const router = useRouter();
  const { registerBuyer } = useAuth();
  const [formData, setFormData] =
    useState<BuyerRegistrationFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof BuyerRegistrationFormData>(
    field: Key,
    value: BuyerRegistrationFormData[Key],
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
      const user = await registerBuyer({
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });
      const requestedRoute = new URLSearchParams(window.location.search).get(
        "next",
      );
      const destination = getPermittedNextDestination(
        user.role,
        requestedRoute,
        window.location.origin,
      );
      router.replace(destination ?? "/");
    } catch (registrationError) {
      setFormError(
        registrationError instanceof Error
          ? registrationError.message
          : "Unable to create your account. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <p
          id="buyer-registration-error"
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-800 sm:col-span-2"
        >
          {formError}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <label htmlFor="buyer-full-name" className="text-sm font-bold text-slate-800">
          Full name
        </label>
        <input
          id="buyer-full-name"
          name="fullName"
          type="text"
          autoComplete="name"
          value={formData.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          aria-invalid={Boolean(fieldErrors.fullName)}
          aria-describedby={fieldErrors.fullName ? "buyer-full-name-error" : undefined}
          placeholder="Ama Mensah"
          className={inputClass}
        />
        {fieldErrors.fullName ? <p id="buyer-full-name-error" className="mt-2 text-xs font-bold text-rose-700">{fieldErrors.fullName}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="buyer-email" className="text-sm font-bold text-slate-800">
          Email address
        </label>
        <input
          id="buyer-email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "buyer-email-error" : undefined}
          placeholder="buyer@example.com"
          className={inputClass}
        />
        {fieldErrors.email ? <p id="buyer-email-error" className="mt-2 text-xs font-bold text-rose-700">{fieldErrors.email}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="buyer-phone" className="text-sm font-bold text-slate-800">
          Phone number <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="buyer-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "buyer-phone-error" : undefined}
          placeholder="0240000000"
          className={inputClass}
        />
        {fieldErrors.phone ? <p id="buyer-phone-error" className="mt-2 text-xs font-bold text-rose-700">{fieldErrors.phone}</p> : null}
      </div>

      <div>
        <label htmlFor="buyer-password" className="text-sm font-bold text-slate-800">
          Password
        </label>
        <div className="relative">
          <input
            id="buyer-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "buyer-password-error" : undefined}
            placeholder="At least 8 characters"
            className={`${inputClass} pr-20`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {fieldErrors.password ? <p id="buyer-password-error" className="mt-2 text-xs font-bold text-rose-700">{fieldErrors.password}</p> : null}
      </div>

      <div>
        <label htmlFor="buyer-confirm-password" className="text-sm font-bold text-slate-800">
          Confirm password
        </label>
        <div className="relative">
          <input
            id="buyer-confirm-password"
            name="confirmPassword"
            type={showConfirmation ? "text" : "password"}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={fieldErrors.confirmPassword ? "buyer-confirm-password-error" : undefined}
            placeholder="Repeat your password"
            className={`${inputClass} pr-20`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmation((visible) => !visible)}
            aria-label={showConfirmation ? "Hide password confirmation" : "Show password confirmation"}
            aria-pressed={showConfirmation}
            className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50"
          >
            {showConfirmation ? "Hide" : "Show"}
          </button>
        </div>
        {fieldErrors.confirmPassword ? <p id="buyer-confirm-password-error" className="mt-2 text-xs font-bold text-rose-700">{fieldErrors.confirmPassword}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-xs leading-5 text-slate-600">
          <input
            type="checkbox"
            checked={formData.acceptedTerms}
            onChange={(event) => updateField("acceptedTerms", event.target.checked)}
            aria-invalid={Boolean(fieldErrors.acceptedTerms)}
            aria-describedby={fieldErrors.acceptedTerms ? "buyer-terms-error" : undefined}
            className="mt-0.5 size-4 rounded border-slate-300 accent-emerald-700"
          />
          <span>I agree to the marketplace terms and conditions and privacy policy.</span>
        </label>
        {fieldErrors.acceptedTerms ? <p id="buyer-terms-error" className="mt-2 text-xs font-bold text-rose-700">{fieldErrors.acceptedTerms}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-500 sm:col-span-2"
      >
        {isSubmitting ? "Creating account..." : "Create Buyer Account"}
      </button>

      <p className="text-center text-sm text-slate-500 sm:col-span-2">
        Already have an account?{" "}
        <Link href="/login" className="font-extrabold text-emerald-700 hover:text-emerald-800">
          Login
        </Link>
      </p>
    </form>
  );
}
