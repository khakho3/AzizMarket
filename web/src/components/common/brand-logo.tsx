import Link from "next/link";

interface BrandLogoProps {
  inverse?: boolean;
}

export function BrandLogo({ inverse = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
      aria-label="AzizMarket home"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-amber-400 text-lg font-black text-slate-950 shadow-sm shadow-amber-950/10">
        A
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${inverse ? "text-white" : "text-slate-950"}`}
      >
        Aziz<span className="text-emerald-600">Market</span>
      </span>
    </Link>
  );
}
