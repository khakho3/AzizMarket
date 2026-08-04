import type { Metadata } from "next";
import { SellerProductsPage } from "@/components/seller/seller-products-page";

export const metadata: Metadata = { title: "Seller Products" };

export default function Page() { return <SellerProductsPage />; }
