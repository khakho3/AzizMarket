import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryForm } from "@/components/admin/category-form";
export const metadata: Metadata = { title: "Edit Category" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <Suspense fallback={<div className="rounded-2xl bg-white p-12 text-center">Loading category…</div>}><CategoryForm categoryId={(await params).id} /></Suspense>; }
