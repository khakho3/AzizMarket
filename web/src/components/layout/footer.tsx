import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { Container } from "@/components/common/container";

const footerGroups = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse products", href: "/products" },
      { label: "Shop categories", href: "/categories" },
      { label: "Your cart", href: "/cart" },
    ],
  },
  {
    title: "Sell with us",
    links: [
      { label: "Become a seller", href: "/seller" },
      { label: "Seller dashboard", href: "/seller" },
      { label: "Seller support", href: "/login" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Orders & messages", href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-16">
        <div>
          <BrandLogo inverse />
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
            AzizMarket connects Ghana&apos;s buyers with trusted local sellers,
            makers and growing businesses.
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
            Buy better. Sell further.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="font-bold text-white">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AzizMarket. Founded by Hassan Abdul Aziz.</p>
          <p>Buy better. Sell further. Prices in Ghana cedis (GH₵).</p>
        </Container>
      </div>
    </footer>
  );
}
