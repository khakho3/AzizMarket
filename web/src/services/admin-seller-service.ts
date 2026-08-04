import {
  ApiRequestError,
  authenticatedApiRequest,
} from "@/services/api";
import type {
  AdminSellerDetail,
  AdminSellerListItem,
  AdminSellerListQuery,
  AdminSellerListResponse,
  RejectSellerRequest,
  VerifySellerRequest,
} from "@/types/admin-seller";

export type AdminSellerOperation = "list" | "detail" | "verify" | "reject";

export function adminSellerErrorMessage(
  error: unknown,
  operation: AdminSellerOperation,
): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401) {
      return "Your session has expired. Please log in again.";
    }
    if (error.status === 403) {
      return operation === "list"
        ? "You do not have permission to view sellers."
        : "You do not have permission to manage this seller.";
    }
    if (error.kind === "network") {
      return "Unable to connect to the server. Please ensure the backend is running.";
    }
    if (error.status === 404 && operation === "detail") {
      return "Seller not found.";
    }
  }

  if (operation === "list") {
    return "Unable to load sellers. Please try again.";
  }
  if (operation === "detail") {
    return "Unable to load seller details. Please try again.";
  }
  if (operation === "verify") {
    return "Unable to verify the seller. Please try again.";
  }
  return "Unable to reject the seller. Please try again.";
}

export async function listAdminSellers(
  query: AdminSellerListQuery,
  signal?: AbortSignal,
): Promise<AdminSellerListResponse> {
  const parameters = new URLSearchParams({
    page: String(query.page),
    page_size: String(query.page_size),
  });
  const search = query.search?.trim();
  if (search) parameters.set("search", search);
  if (query.verification_status) {
    parameters.set("verification_status", query.verification_status);
  }
  if (query.account_status) {
    parameters.set("account_status", query.account_status);
  }

  return authenticatedApiRequest<AdminSellerListResponse>(
    `/admin/sellers?${parameters.toString()}`,
    { signal },
  );
}

export async function getAdminSeller(
  sellerId: string,
  signal?: AbortSignal,
): Promise<AdminSellerDetail> {
  return authenticatedApiRequest<AdminSellerDetail>(
    `/admin/sellers/${encodeURIComponent(sellerId)}`,
    { signal },
  );
}

export async function verifyAdminSeller(
  sellerId: string,
  request: VerifySellerRequest,
): Promise<AdminSellerDetail> {
  return authenticatedApiRequest<AdminSellerDetail>(
    `/admin/sellers/${encodeURIComponent(sellerId)}/verify`,
    { method: "PATCH", body: JSON.stringify(request) },
  );
}

export async function rejectAdminSeller(
  sellerId: string,
  request: RejectSellerRequest,
): Promise<AdminSellerDetail> {
  return authenticatedApiRequest<AdminSellerDetail>(
    `/admin/sellers/${encodeURIComponent(sellerId)}/reject`,
    { method: "PATCH", body: JSON.stringify(request) },
  );
}

export function adminSellerDetailToListItem(
  seller: AdminSellerDetail,
): AdminSellerListItem {
  return {
    seller_profile_id: seller.seller_profile_id,
    user_id: seller.user.id,
    full_name: seller.user.full_name,
    email: seller.user.email,
    phone: seller.user.phone,
    verification_status: seller.verification_status,
    account_status: seller.account_status,
    verification_reason: seller.verification_reason,
    store_id: seller.store?.id ?? null,
    store_name: seller.store?.name ?? null,
    store_slug: seller.store?.slug ?? null,
    store_is_active: seller.store?.is_active ?? null,
    region: seller.store?.region ?? null,
    city: seller.store?.city ?? null,
    created_at: seller.created_at,
    joined_at: seller.joined_at,
  };
}
