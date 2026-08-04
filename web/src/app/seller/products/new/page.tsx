import type { Metadata } from "next";
import { SellerProductForm } from "@/components/seller/seller-product-form";

export const metadata: Metadata = { title: "Add Product" };
export default function Page() { return <SellerProductForm />; }
