import type { Metadata } from "next";
import { AdminSettingsPage } from "@/components/admin/admin-settings-page";
export const metadata: Metadata = { title: "Admin Settings" };
export default function Page() { return <AdminSettingsPage />; }
