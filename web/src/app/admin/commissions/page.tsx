import type { Metadata } from "next";
import { AdminCommissionsPage } from "@/components/admin/admin-commissions-page";
export const metadata: Metadata = { title: "Admin Commissions" };
export default function Page() { return <AdminCommissionsPage />; }
