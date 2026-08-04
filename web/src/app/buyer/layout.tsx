import type { ReactNode } from "react";

// Reserved for authenticated buyer pages such as orders and messages.
export default function BuyerLayout({ children }: { children: ReactNode }) {
  return children;
}
