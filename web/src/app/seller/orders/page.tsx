import type { Metadata } from "next";
import { SellerOrdersPage } from "@/components/seller/seller-orders-page";
export const metadata: Metadata = { title: "Seller Orders" };
export default function Page() { return <SellerOrdersPage />; }
