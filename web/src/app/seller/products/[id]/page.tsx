import type { Metadata } from "next";
import { SellerProductDetails } from "@/components/seller/seller-product-details";

export const metadata: Metadata = { title: "Seller Product Details" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <SellerProductDetails id={(await params).id} />; }
