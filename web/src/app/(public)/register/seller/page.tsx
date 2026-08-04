import type { Metadata } from "next";
import { SellerRegistrationForm } from "@/components/auth/SellerRegistrationForm";
import { AuthShell } from "@/components/common/auth-shell";

export const metadata: Metadata = {
  title: "Create Seller Account",
  description: "Create your AzizMarket seller account and store.",
};

export default function SellerRegistrationPage() {
  return (
    <AuthShell
      eyebrow="Seller registration"
      title="Create your seller account"
      description="Set up your store profile now. An admin will review it before the store becomes publicly active."
    >
      <SellerRegistrationForm />
    </AuthShell>
  );
}
