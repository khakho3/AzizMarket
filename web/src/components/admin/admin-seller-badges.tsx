import type {
  SellerAccountStatus,
  SellerVerificationStatus,
} from "@/types/admin-seller";

function label(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function SellerVerificationBadge({
  status,
}: {
  status: SellerVerificationStatus;
}) {
  const styles = {
    pending: "bg-amber-50 text-amber-800 ring-amber-200",
    verified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-800 ring-rose-200",
  }[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles}`}
    >
      {label(status)}
    </span>
  );
}

export function SellerAccountStatusBadge({
  status,
}: {
  status: SellerAccountStatus;
}) {
  const styles = {
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    suspended: "bg-amber-50 text-amber-800 ring-amber-200",
    banned: "bg-rose-50 text-rose-800 ring-rose-200",
  }[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles}`}
    >
      {label(status)}
    </span>
  );
}

export function StoreActiveBadge({ active }: { active: boolean | null }) {
  const isActive = active === true;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
        isActive
          ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
