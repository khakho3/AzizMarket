import type { Metadata } from "next";
import { AdminBuyersPage } from "@/components/admin/admin-buyers-page";
export const metadata: Metadata = { title: "Admin Buyers" };
export default function Page() { return <AdminBuyersPage />; }
