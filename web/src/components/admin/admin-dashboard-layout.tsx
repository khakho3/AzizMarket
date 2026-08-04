"use client";

import { useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminDashboardLayout({ children }: { children: ReactNode }) { const [open, setOpen] = useState(false); return <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]"><AdminSidebar open={open} onClose={() => setOpen(false)} /><div className="min-w-0"><AdminHeader onMenu={() => setOpen(true)} /><main className="mx-auto max-w-[100rem] p-4 sm:p-6 lg:p-8">{children}</main></div></div>; }
