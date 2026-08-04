import { Container } from "@/components/common/container";
import { ProductGridSkeleton } from "@/components/marketplace/product-grid-skeleton";

export default function CategoryLoading() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <Container>
        <div className="mb-10 animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="h-5 max-w-xl rounded bg-slate-200" />
        </div>
        <ProductGridSkeleton count={4} />
      </Container>
    </section>
  );
}
