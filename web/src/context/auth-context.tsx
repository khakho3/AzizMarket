"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  authenticateUser,
  getCurrentUser,
  registerBuyer as registerBuyerRequest,
  registerSeller as registerSellerRequest,
} from "@/services/auth-service";
import type {
  AuthUser,
  BuyerRegistrationRequest,
  LoginRequest,
  SellerRegistrationRequest,
  SellerRegistrationResponse,
  CurrentUserResponse,
} from "@/types/auth";
import {
  clearAuthSession,
  getAuthStorageSnapshot,
  getServerAuthStorageSnapshot,
  loadAuthSession,
  saveAuthSession,
  serverAuthSnapshot,
  subscribeToAuthStorage,
  updateStoredAuthUser,
} from "@/utils/auth-storage";


interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (credentials: LoginRequest, rememberMe: boolean) => Promise<AuthUser>;
  registerBuyer: (registration: BuyerRegistrationRequest) => Promise<AuthUser>;
  registerSeller: (
    registration: SellerRegistrationRequest,
  ) => Promise<SellerRegistrationResponse>;
  refreshUser: () => Promise<CurrentUserResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const snapshot = useSyncExternalStore(
    subscribeToAuthStorage,
    getAuthStorageSnapshot,
    getServerAuthStorageSnapshot,
  );
  const session = useMemo(
    () => (snapshot === serverAuthSnapshot ? null : loadAuthSession()),
    [snapshot],
  );

  const login = useCallback(
    async (credentials: LoginRequest, rememberMe: boolean) => {
      const response = await authenticateUser(credentials);
      saveAuthSession(response, rememberMe);
      return response.user;
    },
    [],
  );

  const registerBuyer = useCallback(
    async (registration: BuyerRegistrationRequest) => {
      const response = await registerBuyerRequest(registration);
      saveAuthSession(response, false);
      return response.user;
    },
    [],
  );

  const registerSeller = useCallback(
    async (registration: SellerRegistrationRequest) => {
      const response = await registerSellerRequest(registration);
      saveAuthSession(response, false);
      return response;
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    const currentUser = await getCurrentUser();
    updateStoredAuthUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    router.replace("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: Boolean(session?.user && session.accessToken),
      isLoading: snapshot === serverAuthSnapshot,
      login,
      registerBuyer,
      registerSeller,
      refreshUser,
      logout,
    }),
    [
      session,
      snapshot,
      login,
      registerBuyer,
      registerSeller,
      refreshUser,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
