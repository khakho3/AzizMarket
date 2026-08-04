export type UserRole = "buyer" | "seller" | "admin";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BuyerRegistrationRequest {
  full_name: string;
  email: string;
  phone: string | null;
  password: string;
  confirm_password: string;
}

export interface BuyerRegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export type FieldErrors = Partial<
  Record<keyof BuyerRegistrationFormData, string>
>;

export interface SellerRegistrationRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  store_name: string;
  store_description: string | null;
  region: string;
  city: string;
  address: string | null;
}

export interface SellerRegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  storeName: string;
  storeDescription: string;
  region: string;
  city: string;
  address: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export type SellerRegistrationFieldErrors = Partial<
  Record<keyof SellerRegistrationFormData, string>
>;

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  access_token_expires_in: number;
  access_token_expires_at: string;
}

export interface SellerProfile {
  id: string;
  verification_status: "pending" | "verified" | "rejected";
  account_status: "active" | "suspended" | "banned";
  joined_at: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  region: string | null;
  city: string | null;
  address: string | null;
  is_active: boolean;
}

export interface SellerRegistrationResponse extends AuthResponse {
  seller_profile: SellerProfile;
  store: Store;
}

export type LoginResponse = AuthResponse;

export interface ApiError {
  status: number;
  kind: "configuration" | "network" | "response" | "server";
  message: string;
}
