import type { Metadata } from "next";
import { AdminPaymentsPage } from "@/components/admin/admin-payments-page";
export const metadata: Metadata = { title: "Admin Payments" };
export default function Page() { return <AdminPaymentsPage />; }
