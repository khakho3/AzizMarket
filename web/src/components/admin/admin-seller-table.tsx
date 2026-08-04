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

export function AdminSellerTable({
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
    <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white lg:block">
      <table className="w-full min-w-[1420px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">Seller</th>
            <th scope="col" className="px-4 py-3">Contact</th>
            <th scope="col" className="px-4 py-3">Store</th>
            <th scope="col" className="px-4 py-3">Location</th>
            <th scope="col" className="px-4 py-3">Verification</th>
            <th scope="col" className="px-4 py-3">Account</th>
            <th scope="col" className="px-4 py-3">Store status</th>
            <th scope="col" className="px-4 py-3">Joined</th>
            <th scope="col" className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sellers.map((seller) => (
            <tr key={seller.seller_profile_id} className="align-top hover:bg-slate-50/70">
              <td className="px-4 py-4">
                <p className="font-black text-slate-950">{seller.full_name}</p>
                <p className="mt-1 max-w-48 break-all font-mono text-[11px] text-slate-400">
                  {seller.seller_profile_id}
                </p>
              </td>
              <td className="px-4 py-4">
                <a className="font-bold text-emerald-800 hover:underline" href={`mailto:${seller.email}`}>
                  {seller.email}
                </a>
                <p className="mt-1 text-xs text-slate-500">
                  {displayAdminSellerValue(seller.phone)}
                </p>
              </td>
              <td className="px-4 py-4 font-bold text-slate-800">
                {displayAdminSellerValue(seller.store_name)}
              </td>
              <td className="px-4 py-4 text-slate-600">
                {displayAdminSellerValue(seller.region)}
                <span className="block text-xs text-slate-400">
                  {displayAdminSellerValue(seller.city)}
                </span>
              </td>
              <td className="px-4 py-4">
                <SellerVerificationBadge status={seller.verification_status} />
              </td>
              <td className="px-4 py-4">
                <SellerAccountStatusBadge status={seller.account_status} />
              </td>
              <td className="px-4 py-4">
                <StoreActiveBadge active={seller.store_is_active} />
              </td>
              <td className="px-4 py-4 text-xs text-slate-600">
                {formatAdminSellerDate(seller.joined_at)}
              </td>
              <td className="px-4 py-4">
                <AdminSellerActions
                  seller={seller}
                  disabled={disabledSellerId === seller.seller_profile_id}
                  compact
                  onVerify={onVerify}
                  onReject={onReject}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
