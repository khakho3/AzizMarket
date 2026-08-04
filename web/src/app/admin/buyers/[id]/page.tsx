import type { Metadata } from "next";
import { AdminBuyerDetails } from "@/components/admin/admin-buyer-details";
export const metadata: Metadata = { title: "Admin Buyer Details" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <AdminBuyerDetails id={(await params).id} />; }
