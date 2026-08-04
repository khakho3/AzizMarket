interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading products" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] bg-slate-200" />
          <div className="space-y-4 p-5">
            <div className="h-3 w-2/5 rounded bg-slate-200" />
            <div className="space-y-2"><div className="h-4 rounded bg-slate-200" /><div className="h-4 w-3/4 rounded bg-slate-200" /></div>
            <div className="h-6 w-1/2 rounded bg-slate-200" />
            <div className="h-px bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-200" />
            <div className="grid grid-cols-2 gap-2"><div className="h-10 rounded-xl bg-slate-200" /><div className="h-10 rounded-xl bg-slate-200" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
