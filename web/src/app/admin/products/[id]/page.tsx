import type { Metadata } from "next";
import { AdminProductDetails } from "@/components/admin/admin-product-details";
export const metadata: Metadata = { title: "Admin Product Details" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <AdminProductDetails id={(await params).id} />; }
