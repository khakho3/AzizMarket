import type { Metadata } from "next";
import { AdminSellersPage } from "@/components/admin/admin-sellers-page";
export const metadata: Metadata = { title: "Admin Sellers" };
export default function Page() { return <AdminSellersPage />; }
