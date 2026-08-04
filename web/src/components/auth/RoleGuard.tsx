"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthLoadingScreen } from "@/components/auth/AuthLoadingScreen";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  allowedRoles: readonly UserRole[];
  children: ReactNode;
}

const roleDestinations: Record<UserRole, string> = {
  buyer: "/",
  seller: "/seller",
  admin: "/admin",
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const isAllowed = Boolean(
    isAuthenticated && user && allowedRoles.includes(user.role),
  );

  useEffect(() => {
    if (isLoading || isAllowed) return;

    if (!isAuthenticated || !user) {
      const loginDestination = `/login?next=${pathname}`;
      if (pathname !== "/login") router.replace(loginDestination);
      return;
    }

    const destination = roleDestinations[user.role];
    if (pathname !== destination) router.replace(destination);
  }, [isAllowed, isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return <AuthLoadingScreen message="Checking your account..." />;
  }

  if (!isAllowed) {
    return <AuthLoadingScreen message="Redirecting you securely..." />;
  }

  return children;
}
