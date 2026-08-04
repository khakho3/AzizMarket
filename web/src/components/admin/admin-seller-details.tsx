"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  SellerAccountStatusBadge,
  SellerVerificationBadge,
  StoreActiveBadge,
} from "@/components/admin/admin-seller-badges";
import { AdminSellerErrorState } from "@/components/admin/admin-seller-states";
import { RejectSellerModal } from "@/components/admin/reject-seller-modal";
import { VerifySellerModal } from "@/components/admin/verify-seller-modal";
import { CheckIcon } from "@/components/common/icons";
import { Toast, type ToastMessage } from "@/components/common/toast";
import {
  adminSellerErrorMessage,
  getAdminSeller,
  rejectAdminSeller,
  verifyAdminSeller,
} from "@/services/admin-seller-service";
import type { AdminSellerDetail } from "@/types/admin-seller";
import {
  displayAdminSellerValue,
  formatAdminSellerDate,
} from "@/utils/admin-seller";

type ReviewAction = "verify" | "reject" | null;

interface DetailRequestState {
  key: string;
  data: AdminSellerDetail | null;
  error: string | null;
}

function DetailField({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-bold leading-6 text-slate-800">
        {value}
      </dd>
    </div>
  );
}

function DetailLoadingState() {
  return (
    <div role="status" aria-label="Loading seller details" className="space-y-6">
      <span className="sr-only">Loading seller details...</span>
      <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
      <div className="h-28 animate-pulse rounded-2xl bg-white" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
      </div>
    </div>
  );
}

export function AdminSellerDetails({ id }: { id: string }) {
  const [retryVersion, setRetryVersion] = useState(0);
  const [requestState, setRequestState] = useState<DetailRequestState>({
    key: "",
    data: null,
    error: null,
  });
  const [reviewAction, setReviewAction] = useState<ReviewAction>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const requestKey = useMemo(() => `${id}:${retryVersion}`, [id, retryVersion]);

  useEffect(() => {
    const controller = new AbortController();
    getAdminSeller(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setRequestState({ key: requestKey, data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setRequestState({
            key: requestKey,
            data: null,
            error: adminSellerErrorMessage(error, "detail"),
          });
        }
      });
    return () => controller.abort();
  }, [id, requestKey]);

  const isLoading = requestState.key !== requestKey;
  const seller = isLoading ? null : requestState.data;
  const loadError = isLoading ? null : requestState.error;

  function openReview(action: Exclude<ReviewAction, null>) {
    if (isSubmitting) return;
    setActionError(null);
    setReviewAction(action);
  }

  function applyUpdatedSeller(updated: AdminSellerDetail) {
    setRequestState((current) => ({ ...current, data: updated, error: null }));
  }

  async function confirmVerification(note: string | null) {
    if (!seller || reviewAction !== "verify" || isSubmitting) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const updated = await verifyAdminSeller(seller.seller_profile_id, { note });
      if (
        updated.verification_status !== "verified" ||
        updated.store?.is_active !== true
      ) {
        throw new Error("Seller verification did not complete.");
      }
      applyUpdatedSeller(updated);
      setReviewAction(null);
      setToast({
        id: Date.now(),
        message: `${updated.user.full_name} is verified and the store is active.`,
        tone: "success",
      });
    } catch (error) {
      setActionError(adminSellerErrorMessage(error, "verify"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmRejection(reason: string) {
    if (!seller || reviewAction !== "reject" || isSubmitting) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const updated = await rejectAdminSeller(seller.seller_profile_id, {
        reason,
      });
      if (
        updated.verification_status !== "rejected" ||
        updated.store?.is_active !== false
      ) {
        throw new Error("Seller rejection did not complete.");
      }
      applyUpdatedSeller(updated);
      setReviewAction(null);
      setToast({
        id: Date.now(),
        message: `${updated.user.full_name} was rejected and the store is inactive.`,
        tone: "warning",
      });
    } catch (error) {
      setActionError(adminSellerErrorMessage(error, "reject"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <DetailLoadingState />;

  if (loadError || !seller) {
    return (
      <div>
        <Link href="/admin/sellers" className="text-sm font-bold text-emerald-700">
          ← Back to sellers
        </Link>
        <div className="mt-5">
          <AdminSellerErrorState
            message={loadError ?? "Unable to load seller details. Please try again."}
            onRetry={() => setRetryVersion((current) => current + 1)}
          />
        </div>
      </div>
    );
  }

  const store = seller.store;
  const canVerify = seller.verification_status !== "verified";
  const canReject = seller.verification_status !== "rejected";

  return (
    <>
      <Link href="/admin/sellers" className="text-sm font-bold text-emerald-700">
        ← Back to sellers
      </Link>

      <header className="mt-4 rounded-3xl bg-emerald-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
              Seller profile
            </p>
            <h1 className="mt-2 text-3xl font-black">{seller.user.full_name}</h1>
            <p className="mt-2 text-sm text-emerald-100">
              {displayAdminSellerValue(store?.name)} · Joined{" "}
              {formatAdminSellerDate(seller.joined_at)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SellerVerificationBadge status={seller.verification_status} />
            <SellerAccountStatusBadge status={seller.account_status} />
            <StoreActiveBadge active={store?.is_active ?? null} />
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-black text-slate-950">User information</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <DetailField label="Full name" value={seller.user.full_name} />
              <DetailField label="User ID" value={seller.user.id} />
              <DetailField label="Email" value={seller.user.email} />
              <DetailField
                label="Phone"
                value={displayAdminSellerValue(seller.user.phone)}
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-black text-slate-950">Seller information</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <DetailField
                label="Seller profile ID"
                value={seller.seller_profile_id}
              />
              <DetailField
                label="Verification status"
                value={seller.verification_status}
              />
              <DetailField label="Account status" value={seller.account_status} />
              <DetailField
                label="Joined date"
                value={formatAdminSellerDate(seller.joined_at)}
              />
              <DetailField
                label="Created date"
                value={formatAdminSellerDate(seller.created_at)}
              />
              <DetailField
                label="Updated date"
                value={formatAdminSellerDate(seller.updated_at)}
              />
              <DetailField
                label="Verification reason"
                value={displayAdminSellerValue(seller.verification_reason)}
                fullWidth
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">Store information</h2>
              <StoreActiveBadge active={store?.is_active ?? null} />
            </div>
            {store ? (
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <DetailField label="Store ID" value={store.id} />
                <DetailField label="Store name" value={store.name} />
                <DetailField label="Store slug" value={store.slug} />
                <DetailField
                  label="Store email"
                  value={displayAdminSellerValue(store.email)}
                />
                <DetailField
                  label="Store phone"
                  value={displayAdminSellerValue(store.phone)}
                />
                <DetailField
                  label="Region"
                  value={displayAdminSellerValue(store.region)}
                />
                <DetailField
                  label="City"
                  value={displayAdminSellerValue(store.city)}
                />
                <DetailField
                  label="Address"
                  value={displayAdminSellerValue(store.address)}
                  fullWidth
                />
                <DetailField
                  label="Store description"
                  value={displayAdminSellerValue(store.description)}
                  fullWidth
                />
              </dl>
            ) : (
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                This seller does not have a store profile.
              </p>
            )}
          </section>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 xl:sticky xl:top-24 xl:self-start">
          <h2 className="text-lg font-black text-slate-950">Verification actions</h2>
          {seller.verification_status === "verified" ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-emerald-700 text-white">
                  <CheckIcon className="size-5" />
                </span>
                <div>
                  <p className="font-black">Verified</p>
                  <p className="mt-1 text-xs">This seller is already approved.</p>
                </div>
              </div>
            </div>
          ) : null}

          {seller.verification_status === "rejected" && seller.verification_reason ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-rose-700">
                Previous rejection reason
              </p>
              <p className="mt-2 text-sm leading-6 text-rose-900">
                {seller.verification_reason}
              </p>
            </div>
          ) : null}

          <div className="mt-5 grid gap-3">
            {canVerify ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => openReview("verify")}
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                Verify Seller
              </button>
            ) : null}
            {canReject && seller.verification_status === "pending" ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => openReview("reject")}
                className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                Reject Seller
              </button>
            ) : null}
          </div>
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
            Verification activates the seller&apos;s store. Rejection keeps the
            seller account but deactivates the store.
          </p>
        </aside>
      </div>

      {reviewAction === "verify" ? (
        <VerifySellerModal
          sellerName={seller.user.full_name}
          storeName={store?.name ?? null}
          submitting={isSubmitting}
          error={actionError}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmVerification}
        />
      ) : null}
      {reviewAction === "reject" ? (
        <RejectSellerModal
          sellerName={seller.user.full_name}
          storeName={store?.name ?? null}
          submitting={isSubmitting}
          error={actionError}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmRejection}
        />
      ) : null}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
