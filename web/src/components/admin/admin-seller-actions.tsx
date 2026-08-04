import Link from "next/link";
import type { AdminSellerListItem } from "@/types/admin-seller";

export function AdminSellerActions({
  seller,
  disabled,
  compact = false,
  onVerify,
  onReject,
}: {
  seller: AdminSellerListItem;
  disabled: boolean;
  compact?: boolean;
  onVerify: (seller: AdminSellerListItem) => void;
  onReject: (seller: AdminSellerListItem) => void;
}) {
  const padding = compact ? "px-3 py-2" : "px-4 py-2.5";
  const isVerified = seller.verification_status === "verified";
  const isRejected = seller.verification_status === "rejected";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/sellers/${encodeURIComponent(seller.seller_profile_id)}`}
        className={`rounded-lg border border-slate-200 bg-white text-xs font-black text-slate-700 hover:border-emerald-300 hover:text-emerald-800 ${padding}`}
      >
        View Details
      </Link>
      <button
        type="button"
        disabled={disabled || isVerified}
        onClick={() => onVerify(seller)}
        className={`rounded-lg bg-emerald-700 text-xs font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-700 ${padding}`}
      >
        {isVerified ? "Verified" : "Verify"}
      </button>
      <button
        type="button"
        disabled={disabled || isRejected}
        onClick={() => onReject(seller)}
        className={`rounded-lg border border-rose-200 bg-rose-50 text-xs font-black text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-45 ${padding}`}
      >
        {isRejected ? "Rejected" : "Reject"}
      </button>
    </div>
  );
}
