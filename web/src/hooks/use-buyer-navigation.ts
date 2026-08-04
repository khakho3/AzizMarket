"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { roleDestinations } from "@/utils/auth-routes";

function isSafeInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function useBuyerNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const navigateToBuyerRoute = useCallback(
    (destination: string) => {
      if (isLoading || !isSafeInternalPath(destination)) return;

      if (!isAuthenticated || !user) {
        router.replace(`/login?next=${destination}`);
        return;
      }

      if (user.role !== "buyer") {
        router.replace(roleDestinations[user.role]);
        return;
      }

      router.push(destination);
    },
    [isAuthenticated, isLoading, router, user],
  );

  return { navigateToBuyerRoute, isAuthLoading: isLoading };
}
