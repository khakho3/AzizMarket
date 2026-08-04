import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { CheckoutPageContent } from "@/components/checkout/checkout-page-content";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete a frontend demonstration checkout on AzizMarket.",
};

export default function CheckoutPage() {
  return <><PageHeader eyebrow="Secure checkout" title="Complete your order" description="Confirm your contact, delivery and demonstration payment details." /><CheckoutPageContent /></>;
}
