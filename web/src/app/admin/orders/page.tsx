import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminOrdersPage } from "@/components/admin/admin-orders-page";
export const metadata: Metadata = { title: "Admin Orders" };
export default function Page() { return <Suspense fallback={<div className="rounded-2xl bg-white p-12 text-center">Loading orders…</div>}><AdminOrdersPage /></Suspense>; }
