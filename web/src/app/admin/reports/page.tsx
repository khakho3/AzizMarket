import type { Metadata } from "next";
import { AdminReportsPage } from "@/components/admin/admin-reports-page";
export const metadata: Metadata = { title: "Admin Reports" };
export default function Page() { return <AdminReportsPage />; }
