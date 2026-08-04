import type { Metadata } from "next";
import { AdminOrderDetails } from "@/components/admin/admin-order-details";
export const metadata: Metadata = { title: "Admin Order Details" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <AdminOrderDetails id={(await params).id} />; }
