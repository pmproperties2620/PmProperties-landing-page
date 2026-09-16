import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  type = "button",
  target,
  rel,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-heading font-semibold leading-none rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-md hover:shadow-lg",
    secondary:
      "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500",
    ghost:
      "text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
  };

  const sizes = {
    sm: "text-sm px-4 py-2 gap-1.5",
    md: "text-sm lg:text-[15px] px-6 py-3 gap-2",
    lg: "text-sm lg:text-[15px] px-8 py-4 gap-3",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
