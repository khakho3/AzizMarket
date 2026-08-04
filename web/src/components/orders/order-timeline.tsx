import { CheckIcon } from "@/components/common/icons";
import type { OrderStatus, OrderTimelineStep, OrderUpdate } from "@/types";

const standardStages: Array<{ label: OrderStatus; description: string }> = [
  { label: "Order Placed", description: "The order was created successfully." },
  { label: "Payment Pending", description: "Payment is waiting for confirmation." },
  { label: "Payment Confirmed", description: "The selected payment has been confirmed." },
  { label: "Seller Accepted", description: "The seller accepted the order." },
  { label: "Preparing Order", description: "Items are being prepared and packed." },
  { label: "Ready for Delivery", description: "The order is ready for dispatch or pickup." },
  { label: "Out for Delivery", description: "The courier is delivering the order." },
  { label: "Delivered", description: "The order reached the delivery destination." },
  { label: "Completed", description: "The transaction is complete." },
];

function buildTimeline(status: OrderStatus, createdAt: string, updates: OrderUpdate[] = []): OrderTimelineStep[] {
  if (["Cancelled", "Disputed", "Refunded"].includes(status)) {
    const update = [...updates].reverse().find((item) => item.status === status);
    return [
      { label: "Order Placed", description: "The order was created successfully.", date: createdAt, state: "completed" },
      { label: status, description: update?.description ?? (status === "Cancelled" ? "The order was cancelled before fulfilment." : status === "Disputed" ? "A problem was reported and is awaiting review." : "The payment was marked for refund."), date: update?.createdAt, state: "current" },
    ];
  }

  const currentIndex = standardStages.findIndex((stage) => stage.label === status);
  return standardStages.map((stage, index) => {
    const update = [...updates].reverse().find((item) => item.status === stage.label);
    return { ...stage, description: update?.description ?? stage.description, date: update?.createdAt ?? (index === 0 ? createdAt : undefined), state: index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming" };
  });
}

export function OrderTimeline({ status, createdAt, updates }: { status: OrderStatus; createdAt: string; updates?: OrderUpdate[] }) {
  const steps = buildTimeline(status, createdAt, updates);

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-4 pb-7 last:pb-0">
          {index < steps.length - 1 ? <span className={`absolute left-[17px] top-9 h-[calc(100%-1.25rem)] w-0.5 ${step.state === "completed" ? "bg-emerald-600" : "bg-slate-200"}`} /> : null}
          <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full border-2 ${step.state === "completed" ? "border-emerald-600 bg-emerald-600 text-white" : step.state === "current" ? "border-amber-400 bg-amber-100 text-amber-800" : "border-slate-200 bg-white text-slate-300"}`}>
            {step.state === "completed" ? <CheckIcon className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
          </span>
          <div className="pt-1"><p className={`text-sm font-black ${step.state === "upcoming" ? "text-slate-400" : "text-slate-900"}`}>{step.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{step.description}</p>{step.date ? <time dateTime={step.date} className="mt-1 block text-[11px] text-slate-400">{new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(step.date))}</time> : null}</div>
        </li>
      ))}
    </ol>
  );
}
