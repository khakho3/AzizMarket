import type { ReactNode } from "react";
import { GuestOnlyGuard } from "@/components/auth/GuestOnlyGuard";

export default function BuyerRegistrationLayout({ children }: { children: ReactNode }) {
  return <GuestOnlyGuard>{children}</GuestOnlyGuard>;
}
