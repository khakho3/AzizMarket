import type { ReactNode } from "react";
import { BuyerGuard } from "@/components/auth/BuyerGuard";

export default function BuyerOrdersLayout({ children }: { children: ReactNode }) {
  return <BuyerGuard>{children}</BuyerGuard>;
}
