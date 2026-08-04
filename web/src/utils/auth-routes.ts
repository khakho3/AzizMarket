import type { UserRole } from "@/types/auth";

export const roleDestinations: Record<UserRole, string> = {
  buyer: "/",
  seller: "/seller",
  admin: "/admin",
};

const protectedRouteRoles = [
  { prefix: "/orders", role: "buyer" },
  { prefix: "/checkout", role: "buyer" },
  { prefix: "/seller", role: "seller" },
  { prefix: "/admin", role: "admin" },
] as const satisfies ReadonlyArray<{ prefix: string; role: UserRole }>;

function isRouteWithin(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getPermittedNextDestination(
  role: UserRole,
  requestedRoute: string | null,
  currentOrigin: string,
): string | null {
  if (!requestedRoute?.startsWith("/") || requestedRoute.startsWith("//")) {
    return null;
  }

  try {
    const destination = new URL(requestedRoute, currentOrigin);
    if (destination.origin !== currentOrigin) return null;

    const routeRule = protectedRouteRoles.find(({ prefix }) =>
      isRouteWithin(destination.pathname, prefix),
    );
    if (!routeRule || routeRule.role !== role) return null;

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return null;
  }
}
