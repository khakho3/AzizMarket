import { Container } from "@/components/common/container";
import { ProductGridSkeleton } from "@/components/marketplace/product-grid-skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <Container>
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-11 w-72 max-w-full rounded bg-slate-200" />
          <div className="mt-4 h-5 w-full max-w-xl rounded bg-slate-200" />
          <div className="my-10 h-14 rounded-2xl bg-slate-200" />
        </div>
        <ProductGridSkeleton />
      </Container>
    </div>
  );
}
