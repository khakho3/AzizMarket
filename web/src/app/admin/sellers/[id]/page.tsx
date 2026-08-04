import type { Metadata } from "next";
import { AdminSellerDetails } from "@/components/admin/admin-seller-details";
export const metadata: Metadata = { title: "Admin Seller Details" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <AdminSellerDetails id={(await params).id} />; }
