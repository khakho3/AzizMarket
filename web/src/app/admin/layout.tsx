import type { ReactNode } from "react";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </RoleGuard>
  );
}
