export function StatusBadge({ status }: { status: string }) {
  const positive = ["Active", "Paid", "Completed", "Delivered", "Available"].includes(status);
  const warning = ["Pending Review", "Payment Pending", "Pending", "Preparing Order", "Ready for Delivery"].includes(status);
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${positive ? "bg-emerald-50 text-emerald-700" : warning ? "bg-amber-50 text-amber-700" : status === "Rejected" || status === "Cancelled" || status === "Disputed" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>{status}</span>;
}
