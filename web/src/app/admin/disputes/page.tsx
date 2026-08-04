import type { Metadata } from "next";
import { AdminDisputesPage } from "@/components/admin/admin-disputes-page";
export const metadata: Metadata = { title: "Admin Disputes" };
export default function Page() { return <AdminDisputesPage />; }
