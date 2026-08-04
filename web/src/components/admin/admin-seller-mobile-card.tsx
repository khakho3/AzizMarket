import { AdminSellerActions } from "@/components/admin/admin-seller-actions";
import {
  SellerAccountStatusBadge,
  SellerVerificationBadge,
  StoreActiveBadge,
} from "@/components/admin/admin-seller-badges";
import type { AdminSellerListItem } from "@/types/admin-seller";
import {
  displayAdminSellerValue,
  formatAdminSellerDate,
} from "@/utils/admin-seller";

function MobileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-bold text-slate-800">{value}</dd>
    </div>
  );
}

export function AdminSellerMobileCards({
  sellers,
  disabledSellerId,
  onVerify,
  onReject,
}: {
  sellers: AdminSellerListItem[];
  disabledSellerId: string | null;
  onVerify: (seller: AdminSellerListItem) => void;
  onReject: (seller: AdminSellerListItem) => void;
}) {
  return (
    <div className="grid gap-4 lg:hidden">
      {sellers.map((seller) => (
        <article
          key={seller.seller_profile_id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">{seller.full_name}</h2>
              <p className="mt-1 break-all font-mono text-[11px] text-slate-400">
                {seller.seller_profile_id}
              </p>
            </div>
            <SellerVerificationBadge status={seller.verification_status} />
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <MobileField label="Email" value={seller.email} />
            <MobileField label="Phone" value={displayAdminSellerValue(seller.phone)} />
            <MobileField label="Store" value={displayAdminSellerValue(seller.store_name)} />
            <MobileField
              label="Location"
              value={`${displayAdminSellerValue(seller.region)} · ${displayAdminSellerValue(seller.city)}`}
            />
            <MobileField label="Joined" value={formatAdminSellerDate(seller.joined_at)} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <SellerAccountStatusBadge status={seller.account_status} />
            <StoreActiveBadge active={seller.store_is_active} />
          </div>
          <div className="mt-5">
            <AdminSellerActions
              seller={seller}
              disabled={disabledSellerId === seller.seller_profile_id}
              onVerify={onVerify}
              onReject={onReject}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
