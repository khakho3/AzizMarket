"use client";

import { useState, type ReactNode } from "react";
import { SellerHeader } from "@/components/seller/seller-header";
import { SellerSidebar } from "@/components/seller/seller-sidebar";

export function SellerDashboardLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]"><SellerSidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="min-w-0"><SellerHeader onMenu={() => setMenuOpen(true)} /><main className="mx-auto max-w-[96rem] p-4 sm:p-6 lg:p-8">{children}</main></div></div>;
}
