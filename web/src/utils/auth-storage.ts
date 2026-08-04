import type { AuthResponse, AuthUser } from "@/types/auth";


export const authStorageKeys = {
  accessToken: "marketplace_access_token",
  refreshToken: "marketplace_refresh_token",
  user: "marketplace_user",
  rememberMe: "marketplace_remember_me",
} as const;

export const authStorageChangeEvent = "marketplace-auth-change";
export const serverAuthSnapshot = "marketplace-auth-server-snapshot";

export interface StoredAuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
}

function isUserRole(value: unknown): value is AuthUser["role"] {
  return value === "buyer" || value === "seller" || value === "admin";
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AuthUser>;
  return (
    typeof user.id === "string" &&
    typeof user.full_name === "string" &&
    typeof user.email === "string" &&
    isUserRole(user.role) &&
    typeof user.is_active === "boolean" &&
    typeof user.created_at === "string"
  );
}

function clearStorage(storage: Storage): void {
  Object.values(authStorageKeys).forEach((key) => storage.removeItem(key));
}

function readFromStorage(
  storage: Storage,
  expectedRememberMe: boolean,
): StoredAuthSession | null {
  const rememberMe = storage.getItem(authStorageKeys.rememberMe);
  if (rememberMe !== String(expectedRememberMe)) return null;

  const accessToken = storage.getItem(authStorageKeys.accessToken);
  const refreshToken = storage.getItem(authStorageKeys.refreshToken);
  const savedUser = storage.getItem(authStorageKeys.user);
  if (!accessToken || !refreshToken || !savedUser) {
    clearStorage(storage);
    return null;
  }

  try {
    const user: unknown = JSON.parse(savedUser);
    if (!isAuthUser(user)) {
      clearStorage(storage);
      return null;
    }
    return { user, accessToken, refreshToken, rememberMe: expectedRememberMe };
  } catch {
    clearStorage(storage);
    return null;
  }
}

function notifyAuthChange(): void {
  window.dispatchEvent(new Event(authStorageChangeEvent));
}

export function saveAuthSession(response: AuthResponse, rememberMe: boolean): void {
  if (typeof window === "undefined") return;
  clearStorage(window.localStorage);
  clearStorage(window.sessionStorage);

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem(authStorageKeys.accessToken, response.access_token);
  storage.setItem(authStorageKeys.refreshToken, response.refresh_token);
  storage.setItem(authStorageKeys.user, JSON.stringify(response.user));
  storage.setItem(authStorageKeys.rememberMe, String(rememberMe));
  notifyAuthChange();
}

export function loadAuthSession(): StoredAuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      readFromStorage(window.localStorage, true) ??
      readFromStorage(window.sessionStorage, false)
    );
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  try {
    clearStorage(window.localStorage);
    clearStorage(window.sessionStorage);
  } finally {
    notifyAuthChange();
  }
}

export function getAuthStorageSnapshot(): string {
  if (typeof window === "undefined") return serverAuthSnapshot;
  try {
    return JSON.stringify([
      ...Object.values(authStorageKeys).map((key) => window.localStorage.getItem(key)),
      ...Object.values(authStorageKeys).map((key) => window.sessionStorage.getItem(key)),
    ]);
  } catch {
    return "marketplace-auth-unavailable";
  }
}

export function getServerAuthStorageSnapshot(): string {
  return serverAuthSnapshot;
}

export function subscribeToAuthStorage(callback: () => void): () => void {
  function handleStorage(event: StorageEvent): void {
    if (
      event.key &&
      Object.values(authStorageKeys).some((key) => key === event.key)
    ) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(authStorageChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(authStorageChangeEvent, callback);
  };
}
