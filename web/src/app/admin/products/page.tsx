import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminProductsPage } from "@/components/admin/admin-products-page";
export const metadata: Metadata = { title: "Admin Products" };
export default function Page() { return <Suspense fallback={<div className="rounded-2xl bg-white p-12 text-center">Loading products…</div>}><AdminProductsPage /></Suspense>; }
