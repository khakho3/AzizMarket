import type { Metadata } from "next";
import { SellerStorePage } from "@/components/seller/seller-store-page";
export const metadata: Metadata = { title: "Seller Store Profile" };
export default function Page() { return <SellerStorePage />; }
