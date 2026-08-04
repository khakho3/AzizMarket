import type { Metadata } from "next";
import { SellerOrderDetails } from "@/components/seller/seller-order-details";
export const metadata: Metadata = { title: "Seller Order Details" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <SellerOrderDetails id={(await params).id} />; }
