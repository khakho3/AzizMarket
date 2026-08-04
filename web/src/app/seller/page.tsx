import type { Metadata } from "next";
import { SellerOverview } from "@/components/seller/seller-overview";

export const metadata: Metadata = { title: "Seller Dashboard" };

export default async function SellerPage({
  searchParams,
}: {
  searchParams: Promise<{ registration?: string | string[] }>;
}) {
  const { registration } = await searchParams;
  return <SellerOverview showRegistrationSuccess={registration === "success"} />;
}
