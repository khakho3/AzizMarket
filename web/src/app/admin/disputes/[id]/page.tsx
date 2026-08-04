import type { Metadata } from "next";
import { AdminDisputeDetails } from "@/components/admin/admin-dispute-details";
export const metadata: Metadata = { title: "Admin Dispute Details" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <AdminDisputeDetails id={(await params).id} />; }
