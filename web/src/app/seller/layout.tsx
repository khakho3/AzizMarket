import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { SellerDashboardLayout } from "@/components/seller/seller-dashboard-layout";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["seller"]}>
      <SellerDashboardLayout>{children}</SellerDashboardLayout>
    </RoleGuard>
  );
}
