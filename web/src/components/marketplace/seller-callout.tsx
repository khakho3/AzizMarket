import Link from "next/link";
import { ArrowRightIcon, StoreIcon } from "@/components/common/icons";
import { Container } from "@/components/common/container";

export function SellerCallout() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-amber-400 px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div className="absolute -right-12 -top-16 size-64 rounded-full border-[40px] border-amber-300/70" />
          <div className="relative flex max-w-2xl items-start gap-5">
            <span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white sm:grid">
              <StoreIcon className="size-7" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-900">
                Grow your business
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Ready to sell to more customers?
              </h2>
              <p className="mt-3 leading-7 text-slate-800">
                Open your storefront, showcase your products and build lasting
                relationships with buyers across Ghana.
              </p>
            </div>
          </div>
          <Link
            href="/seller"
            className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-emerald-950 lg:mt-0"
          >
            Become a Seller <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
