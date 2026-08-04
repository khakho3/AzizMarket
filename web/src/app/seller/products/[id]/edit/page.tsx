import type { Metadata } from "next";
import { SellerProductForm } from "@/components/seller/seller-product-form";

export const metadata: Metadata = { title: "Edit Product" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <SellerProductForm productId={(await params).id} />; }
