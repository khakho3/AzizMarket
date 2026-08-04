"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AdminSellerMobileCards } from "@/components/admin/admin-seller-mobile-card";
import { AdminSellerPagination } from "@/components/admin/admin-seller-pagination";
import {
  AdminSellerEmptyState,
  AdminSellerErrorState,
  AdminSellerLoadingState,
} from "@/components/admin/admin-seller-states";
import { AdminSellerTable } from "@/components/admin/admin-seller-table";
import { RejectSellerModal } from "@/components/admin/reject-seller-modal";
import { VerifySellerModal } from "@/components/admin/verify-seller-modal";
import { SearchIcon } from "@/components/common/icons";
import { Toast, type ToastMessage } from "@/components/common/toast";
import {
  adminSellerDetailToListItem,
  adminSellerErrorMessage,
  listAdminSellers,
  rejectAdminSeller,
  verifyAdminSeller,
} from "@/services/admin-seller-service";
import type {
  AdminSellerListItem,
  AdminSellerListQuery,
  AdminSellerListResponse,
  SellerAccountStatus,
  SellerVerificationStatus,
} from "@/types/admin-seller";

type ReviewAction =
  | { type: "verify"; seller: AdminSellerListItem }
  | { type: "reject"; seller: AdminSellerListItem };

interface SellerRequestState {
  key: string;
  data: AdminSellerListResponse | null;
  error: string | null;
}

const pageSize = 20;

export function AdminSellersPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [verificationStatus, setVerificationStatus] = useState<
    SellerVerificationStatus | ""
  >("");
  const [accountStatus, setAccountStatus] = useState<
    SellerAccountStatus | ""
  >("");
  const [page, setPage] = useState(1);
  const [retryVersion, setRetryVersion] = useState(0);
  const [requestState, setRequestState] = useState<SellerRequestState>({
    key: "",
    data: null,
    error: null,
  });
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const query = useMemo<AdminSellerListQuery>(
    () => ({
      search: deferredSearch,
      verification_status: verificationStatus || undefined,
      account_status: accountStatus || undefined,
      page,
      page_size: pageSize,
    }),
    [accountStatus, deferredSearch, page, verificationStatus],
  );
  const requestKey = useMemo(
    () => JSON.stringify({ ...query, retryVersion }),
    [query, retryVersion],
  );

  useEffect(() => {
    const controller = new AbortController();
    listAdminSellers(query, controller.signal)
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
            error: adminSellerErrorMessage(error, "list"),
          });
        }
      });
    return () => controller.abort();
  }, [query, requestKey]);

  const isLoading = requestState.key !== requestKey;
  const response = isLoading ? null : requestState.data;
  const loadError = isLoading ? null : requestState.error;
  const disabledSellerId = isSubmitting
    ? reviewAction?.seller.seller_profile_id ?? null
    : null;

  function clearFilters() {
    setSearch("");
    setVerificationStatus("");
    setAccountStatus("");
    setPage(1);
    setRetryVersion((current) => current + 1);
  }

  function openReview(type: ReviewAction["type"], seller: AdminSellerListItem) {
    if (isSubmitting) return;
    setActionError(null);
    setReviewAction({ type, seller });
  }

  function updateSellerRow(seller: AdminSellerListItem) {
    setRequestState((current) => {
      if (!current.data) return current;
      return {
        ...current,
        data: {
          ...current.data,
          items: current.data.items.map((item) =>
            item.seller_profile_id === seller.seller_profile_id ? seller : item,
          ),
        },
      };
    });
  }

  async function confirmVerification(note: string | null) {
    if (!reviewAction || reviewAction.type !== "verify" || isSubmitting) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const updated = await verifyAdminSeller(reviewAction.seller.seller_profile_id, {
        note,
      });
      if (
        updated.verification_status !== "verified" ||
        updated.store?.is_active !== true
      ) {
        throw new Error("Seller verification did not complete.");
      }
      updateSellerRow(adminSellerDetailToListItem(updated));
      setToast({
        id: Date.now(),
        message: `${updated.user.full_name} is verified and the store is active.`,
        tone: "success",
      });
      setReviewAction(null);
    } catch (error) {
      setActionError(adminSellerErrorMessage(error, "verify"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmRejection(reason: string) {
    if (!reviewAction || reviewAction.type !== "reject" || isSubmitting) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const updated = await rejectAdminSeller(reviewAction.seller.seller_profile_id, {
        reason,
      });
      if (
        updated.verification_status !== "rejected" ||
        updated.store?.is_active !== false
      ) {
        throw new Error("Seller rejection did not complete.");
      }
      updateSellerRow(adminSellerDetailToListItem(updated));
      setToast({
        id: Date.now(),
        message: `${updated.user.full_name} was rejected and the store is inactive.`,
        tone: "warning",
      });
      setReviewAction(null);
    } catch (error) {
      setActionError(adminSellerErrorMessage(error, "reject"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div>
        <p className="text-sm font-bold text-emerald-700">Marketplace accounts</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Sellers</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review registered sellers, activate verified stores, and track account status.
        </p>
      </div>

      <section
        aria-label="Seller filters"
        className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[minmax(18rem,1fr)_15rem_15rem_auto] lg:items-end"
      >
        <label className="text-xs font-bold text-slate-700">
          Search sellers
          <span className="relative mt-2 block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Name, email, phone or store"
            />
          </span>
        </label>
        <label className="text-xs font-bold text-slate-700">
          Verification status
          <select
            value={verificationStatus}
            onChange={(event) => {
              setVerificationStatus(
                event.target.value as SellerVerificationStatus | "",
              );
              setPage(1);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500"
          >
            <option value="">All verification statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="text-xs font-bold text-slate-700">
          Account status
          <select
            value={accountStatus}
            onChange={(event) => {
              setAccountStatus(event.target.value as SellerAccountStatus | "");
              setPage(1);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500"
          >
            <option value="">All account statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </label>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
        >
          Clear filters
        </button>
      </section>

      <div className="mt-6">
        {isLoading ? <AdminSellerLoadingState /> : null}
        {loadError ? (
          <AdminSellerErrorState
            message={loadError}
            onRetry={() => setRetryVersion((current) => current + 1)}
          />
        ) : null}
        {response && response.items.length === 0 ? (
          <AdminSellerEmptyState onClearFilters={clearFilters} />
        ) : null}
        {response && response.items.length > 0 ? (
          <div className="space-y-4">
            <AdminSellerTable
              sellers={response.items}
              disabledSellerId={disabledSellerId}
              onVerify={(seller) => openReview("verify", seller)}
              onReject={(seller) => openReview("reject", seller)}
            />
            <AdminSellerMobileCards
              sellers={response.items}
              disabledSellerId={disabledSellerId}
              onVerify={(seller) => openReview("verify", seller)}
              onReject={(seller) => openReview("reject", seller)}
            />
            <AdminSellerPagination
              page={response.page}
              totalPages={response.total_pages}
              total={response.total}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      {reviewAction?.type === "verify" ? (
        <VerifySellerModal
          sellerName={reviewAction.seller.full_name}
          storeName={reviewAction.seller.store_name}
          submitting={isSubmitting}
          error={actionError}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmVerification}
        />
      ) : null}
      {reviewAction?.type === "reject" ? (
        <RejectSellerModal
          sellerName={reviewAction.seller.full_name}
          storeName={reviewAction.seller.store_name}
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
