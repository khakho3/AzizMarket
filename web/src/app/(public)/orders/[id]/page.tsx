import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { OrderDetailsContent } from "@/components/orders/order-details-content";

export const metadata: Metadata = { title: "Order Details", description: "Review your AzizMarket order details and delivery timeline." };

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <><Container className="py-5"><nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500"><Link href="/" className="hover:text-emerald-700">Home</Link><span>/</span><Link href="/orders" className="hover:text-emerald-700">Orders</Link><span>/</span><span className="font-semibold text-slate-700">{id}</span></nav></Container><OrderDetailsContent orderId={id} /></>;
}
