import { LeadStatus } from "@/lib/supabaseServer";

interface StatusBadgeProps {
  status: LeadStatus | string;
  className?: string;
  size?: "sm" | "md";
}

export const STATUS_DETAILS: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  new: {
    label: "New",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200/60",
    dot: "bg-blue-500",
  },
  contacted: {
    label: "Contacted",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200/60",
    dot: "bg-amber-500",
  },
  qualified: {
    label: "Qualified",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200/60",
    dot: "bg-purple-500",
  },
  converted: {
    label: "Converted",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200/60",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200/60",
    dot: "bg-slate-400",
  },
};

export default function StatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
  const details = STATUS_DETAILS[status] || {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] gap-1"
      : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-heading font-semibold uppercase tracking-[0.04em] border ${details.bg} ${details.text} ${details.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${details.dot}`} />
      <span>{details.label}</span>
    </span>
  );
}
