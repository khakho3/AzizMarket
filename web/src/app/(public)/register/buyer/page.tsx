import type { Metadata } from "next";
import { BuyerRegistrationForm } from "@/components/auth/BuyerRegistrationForm";
import { AuthShell } from "@/components/common/auth-shell";

export const metadata: Metadata = {
  title: "Create Buyer Account",
  description: "Create your AzizMarket buyer account.",
};

export default function BuyerRegistrationPage() {
  return (
    <AuthShell
      eyebrow="Buyer registration"
      title="Create your buyer account"
      description="Join AzizMarket to shop, contact trusted sellers and manage your orders."
    >
      <BuyerRegistrationForm />
    </AuthShell>
  );
}
