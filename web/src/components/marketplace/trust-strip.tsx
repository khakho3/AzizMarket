import { Container } from "@/components/common/container";
import { MessageIcon, ShieldIcon, TruckIcon } from "@/components/common/icons";

const promises = [
  {
    title: "Trusted local sellers",
    description: "Shop confidently from rated Ghanaian stores",
    icon: ShieldIcon,
  },
  {
    title: "Delivery across Ghana",
    description: "Choose delivery options that work for you",
    icon: TruckIcon,
  },
  {
    title: "Chat before you buy",
    description: "Ask sellers questions directly and quickly",
    icon: MessageIcon,
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <Container className="grid divide-y divide-slate-200 py-3 md:grid-cols-3 md:divide-x md:divide-y-0">
        {promises.map(({ title, description, icon: Icon }, index) => (
          <div
            key={title}
            className={`flex items-center gap-4 py-5 md:px-6 ${index === 0 ? "md:pl-0" : ""}`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
