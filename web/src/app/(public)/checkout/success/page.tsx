import type { Metadata } from "next";
import { CheckoutSuccessContent } from "@/components/checkout/checkout-success-content";

export const metadata: Metadata = { title: "Order Placed", description: "Your AzizMarket order was placed successfully." };

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams;
  return <CheckoutSuccessContent orderId={orderId} />;
}
