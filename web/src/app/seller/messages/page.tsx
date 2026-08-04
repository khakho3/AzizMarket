import type { Metadata } from "next";
import { Suspense } from "react";
import { SellerMessagesPage } from "@/components/seller/seller-messages-page";
export const metadata: Metadata = { title: "Seller Messages" };
export default function Page() { return <Suspense fallback={<div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500">Loading conversations…</div>}><SellerMessagesPage /></Suspense>; }
