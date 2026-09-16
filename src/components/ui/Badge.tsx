import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "featured";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-brand-100 text-brand-700",
    featured: "bg-brand-600 text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-heading font-semibold text-xs leading-none uppercase tracking-[0.05em]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
