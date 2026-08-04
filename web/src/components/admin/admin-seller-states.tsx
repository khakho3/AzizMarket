export function AdminSellerLoadingState() {
  return (
    <div aria-label="Loading sellers" role="status">
      <span className="sr-only">Loading sellers...</span>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
        <div className="h-12 animate-pulse bg-slate-100" />
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 px-5 py-5"
            >
              {Array.from({ length: 6 }, (_, item) => (
                <div
                  key={item}
                  className="h-4 animate-pulse rounded-full bg-slate-100"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="h-5 w-1/2 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-6 h-10 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSellerEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h2 className="text-xl font-black text-slate-950">No sellers found.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try clearing the current search and status filters.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800"
      >
        Clear filters
      </button>
    </section>
  );
}

export function AdminSellerErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center"
    >
      <h2 className="text-lg font-black text-rose-950">Sellers unavailable</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-rose-800">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-rose-700 px-5 py-3 text-sm font-black text-white hover:bg-rose-800"
      >
        Retry
      </button>
    </section>
  );
}
