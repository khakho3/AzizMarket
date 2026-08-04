import type { Metadata } from "next";
import { AdminWithdrawalsPage } from "@/components/admin/admin-withdrawals-page";
export const metadata: Metadata = { title: "Admin Withdrawals" };
export default function Page() { return <AdminWithdrawalsPage />; }
