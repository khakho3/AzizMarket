import type { Metadata } from "next";
import { SellerEarningsPage } from "@/components/seller/seller-earnings-page";
export const metadata: Metadata = { title: "Seller Earnings" };
export default function Page() { return <SellerEarningsPage />; }
