import Link from "next/link";
import { ArrowRightIcon } from "@/components/common/icons";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel = "View all",
}: SectionHeadingProps) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6 sm:mb-9">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {linkHref ? (
        <Link
          href={linkHref}
          className="hidden shrink-0 items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800 sm:inline-flex"
        >
          {linkLabel}
          <ArrowRightIcon className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
