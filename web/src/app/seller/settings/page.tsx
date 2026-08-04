import type { Metadata } from "next";
import { SellerSettingsPage } from "@/components/seller/seller-settings-page";
export const metadata: Metadata = { title: "Seller Settings" };
export default function Page() { return <SellerSettingsPage />; }
