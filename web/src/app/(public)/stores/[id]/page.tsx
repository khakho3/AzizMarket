import type { Metadata } from "next";
import { PublicStorePage } from "@/components/marketplace/public-store-page";
export const metadata: Metadata = { title: "Seller Store" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <PublicStorePage id={(await params).id} />; }
