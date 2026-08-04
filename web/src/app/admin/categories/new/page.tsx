import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryForm } from "@/components/admin/category-form";
export const metadata: Metadata = { title: "Add Category" };
export default function Page() { return <Suspense fallback={<div className="rounded-2xl bg-white p-12 text-center">Loading category form…</div>}><CategoryForm /></Suspense>; }
