import type { Metadata } from "next";
import { AdminMessagesPage } from "@/components/admin/admin-messages-page";
export const metadata: Metadata = { title: "Admin Messages" };
export default function Page() { return <AdminMessagesPage />; }
