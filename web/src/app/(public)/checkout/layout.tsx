import type { ReactNode } from "react";
import { BuyerGuard } from "@/components/auth/BuyerGuard";

export default function BuyerCheckoutLayout({ children }: { children: ReactNode }) {
  return <BuyerGuard>{children}</BuyerGuard>;
}
