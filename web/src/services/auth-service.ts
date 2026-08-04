import { ApiRequestError, apiRequest } from "@/services/api";
import type {
  AuthResponse,
  BuyerRegistrationRequest,
  LoginRequest,
  LoginResponse,
  SellerRegistrationRequest,
  SellerRegistrationResponse,
} from "@/types/auth";

function registrationError(
  error: unknown,
  accountType: "buyer" | "seller",
): Error {
  const fallback =
    accountType === "seller"
      ? "Unable to create your seller account. Please try again."
      : "Unable to create your account. Please try again.";

  if (!(error instanceof ApiRequestError)) return new Error(fallback);
  if (error.kind === "network") {
    return new Error(
      "Unable to connect to the server. Please ensure the backend is running.",
    );
  }
  if (error.status === 409) {
    return new Error("An account with this email already exists.");
  }
  if (error.status === 422) {
    return new Error(
      error.message.startsWith("Please check the following fields:")
        ? error.message
        : "Please review your registration details. One or more fields are invalid.",
    );
  }
  if (error.status === 400) {
    return new Error("The password and confirmation do not match.");
  }
  return new Error(fallback);
}


export async function authenticateUser(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  try {
    return await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    if (!(error instanceof ApiRequestError)) {
      throw new Error("Unexpected server error. Please try again.");
    }
    if (error.kind === "network") {
      throw new Error(
        "Unable to connect to the server. Please ensure the backend is running.",
      );
    }
    if (error.status === 401) {
      throw new Error("Incorrect email or password.");
    }
    if (error.status === 403) {
      const detail = error.message.toLowerCase();
      if (detail.includes("inactive")) {
        throw new Error("Your account is inactive. Please contact support.");
      }
      if (detail.includes("suspended")) {
        throw new Error("Your seller account is suspended. Please contact support.");
      }
      if (detail.includes("banned")) {
        throw new Error("Your seller account is banned. Please contact support.");
      }
      throw new Error("You do not have permission to access this account.");
    }
    if (error.status === 422) {
      throw new Error("Please enter a valid email address and password.");
    }
    throw new Error("Unexpected server error. Please try again.");
  }
}

export async function registerBuyer(
  registration: BuyerRegistrationRequest,
): Promise<AuthResponse> {
  try {
    return await apiRequest<AuthResponse>("/auth/register/buyer", {
      method: "POST",
      body: JSON.stringify(registration),
    });
  } catch (error) {
    throw registrationError(error, "buyer");
  }
}

export async function registerSeller(
  registration: SellerRegistrationRequest,
): Promise<SellerRegistrationResponse> {
  try {
    return await apiRequest<SellerRegistrationResponse>("/auth/register/seller", {
      method: "POST",
      body: JSON.stringify(registration),
    });
  } catch (error) {
    throw registrationError(error, "seller");
  }
}
