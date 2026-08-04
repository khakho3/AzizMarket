import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/common/icons";

export function AdminSellerPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const displayTotalPages = Math.max(1, totalPages);
  return (
    <nav
      aria-label="Seller pagination"
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-600">
        Page <span className="font-black text-slate-950">{page}</span> of{" "}
        <span className="font-black text-slate-950">{displayTotalPages}</span>
        <span className="ml-2 text-slate-400">({total} sellers)</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
          <ChevronLeftIcon className="size-4" /> Previous
        </button>
        <button
          type="button"
          disabled={totalPages === 0 || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
          Next <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </nav>
  );
}
