import type { AuthUser, Store } from "@/types/auth";

export type SellerVerificationStatus = "pending" | "verified" | "rejected";
export type SellerAccountStatus = "active" | "suspended" | "banned";

export interface AdminSellerListItem {
  seller_profile_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  verification_status: SellerVerificationStatus;
  account_status: SellerAccountStatus;
  verification_reason: string | null;
  store_id: string | null;
  store_name: string | null;
  store_slug: string | null;
  store_is_active: boolean | null;
  region: string | null;
  city: string | null;
  created_at: string;
  joined_at: string;
}

export interface AdminSellerDetail {
  seller_profile_id: string;
  user: AuthUser;
  store: Store | null;
  verification_status: SellerVerificationStatus;
  account_status: SellerAccountStatus;
  verification_reason: string | null;
  created_at: string;
  updated_at: string;
  joined_at: string;
}

export interface AdminSellerListResponse {
  items: AdminSellerListItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface VerifySellerRequest {
  note: string | null;
}

export interface RejectSellerRequest {
  reason: string;
}

export interface AdminSellerListQuery {
  search?: string;
  verification_status?: SellerVerificationStatus;
  account_status?: SellerAccountStatus;
  page: number;
  page_size: number;
}
