"use client";

import { useEffect, useState } from "react";
import { SellerVerificationBadge } from "@/components/admin/admin-seller-badges";
import { ApiRequestError } from "@/services/api";
import { useAuth } from "@/context/auth-context";

function refreshErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401) {
      return "Your session has expired. Please log in again.";
    }
    if (error.status === 403) {
      return "You do not have permission to refresh seller status.";
    }
    if (error.kind === "network") {
      return "Unable to connect to the server. Please ensure the backend is running.";
    }
  }
  return "Unable to refresh seller status. Please try again.";
}

export function SellerVerificationPanel() {
  const { user, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "seller") return;
    let active = true;
    refreshUser()
      .then(() => {
        if (active) {
          setError(null);
          setIsRefreshing(false);
        }
      })
      .catch((refreshError: unknown) => {
        if (active) {
          setError(refreshErrorMessage(refreshError));
          setIsRefreshing(false);
        }
      });
    return () => {
      active = false;
    };
  }, [refreshUser, user?.role]);

  async function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);
    try {
      await refreshUser();
    } catch (refreshError) {
      setError(refreshErrorMessage(refreshError));
    } finally {
      setIsRefreshing(false);
    }
  }

  const profile = user?.seller_profile;
  const status = profile?.verification_status;
  const rejectionReason = profile?.verification_reason;
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-950",
    verified: "border-emerald-200 bg-emerald-50 text-emerald-950",
    rejected: "border-rose-200 bg-rose-50 text-rose-950",
  } as const;
  const messages = {
    pending: "Your seller account is awaiting administrator verification.",
    verified: "Your seller account is verified and your store is active.",
    rejected: "Your seller verification was rejected.",
  } as const;

  if (isRefreshing && !status) {
    return (
      <section
        role="status"
        aria-label="Refreshing seller verification status"
        className="mb-6 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
      >
        <div className="h-4 w-40 rounded-full bg-slate-100" />
        <div className="mt-3 h-5 max-w-xl rounded-full bg-slate-100" />
      </section>
    );
  }

  return (
    <section
      aria-labelledby="seller-verification-heading"
      className={`mb-6 rounded-2xl border p-5 ${
        status ? styles[status] : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="seller-verification-heading" className="font-black">
              Seller verification
            </h2>
            {status ? <SellerVerificationBadge status={status} /> : null}
          </div>
          <p className="mt-2 text-sm font-bold leading-6">
            {status
              ? messages[status]
              : "Seller verification information is not available yet."}
          </p>
          {status === "rejected" && rejectionReason ? (
            <p className="mt-3 rounded-xl bg-white/70 p-3 text-sm leading-6">
              <span className="font-black">Reason:</span>{" "}
              {rejectionReason}
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="mt-3 text-sm font-bold text-rose-700">
              {error}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="shrink-0 rounded-xl border border-current/20 bg-white px-4 py-2.5 text-sm font-black shadow-sm disabled:cursor-wait disabled:opacity-60"
        >
          {isRefreshing ? "Refreshing..." : "Refresh status"}
        </button>
      </div>
    </section>
  );
}
