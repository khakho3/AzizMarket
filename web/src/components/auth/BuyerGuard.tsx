import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";

export function BuyerGuard({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["buyer"]}>{children}</RoleGuard>;
}
