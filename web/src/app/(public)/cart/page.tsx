import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review products in your AzizMarket cart and continue to checkout.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your basket"
        title="Shopping cart"
        description="Review quantities, seller details and estimated costs before checkout."
      />
      <CartPageContent />
    </>
  );
}
