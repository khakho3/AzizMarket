"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthLoadingScreen } from "@/components/auth/AuthLoadingScreen";
import { useAuth } from "@/context/auth-context";
import { roleDestinations } from "@/utils/auth-routes";

export function GuestOnlyGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const destination = roleDestinations[user.role];
    if (pathname !== destination) router.replace(destination);
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return <AuthLoadingScreen message="Checking your account..." />;
  }

  if (isAuthenticated && user) {
    return <AuthLoadingScreen message="Redirecting you securely..." />;
  }

  return children;
}
