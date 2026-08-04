interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = status.toLowerCase();
  const className =
    normalized.includes("completed") || normalized === "paid" || normalized === "delivered"
      ? "bg-emerald-100 text-emerald-800"
      : normalized.includes("cancel") || normalized.includes("refund")
        ? "bg-slate-200 text-slate-700"
        : normalized.includes("disputed")
          ? "bg-rose-100 text-rose-800"
          : normalized.includes("pending") || normalized.includes("placed") || normalized.includes("partially")
            ? "bg-amber-100 text-amber-800"
            : "bg-sky-100 text-sky-800";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ${className}`}>{status}</span>;
}
