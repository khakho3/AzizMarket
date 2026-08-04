import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { OrdersPageContent } from "@/components/orders/orders-page-content";

export const metadata: Metadata = { title: "My Orders", description: "Track your saved AzizMarket orders." };

export default function OrdersPage() {
  return <><PageHeader eyebrow="Buyer account" title="My Orders" description="Search orders, review payment status and follow delivery progress." /><OrdersPageContent /></>;
}
