import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`u-label inline-flex items-center gap-2 ${className}`}>
      <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
      {children}
    </span>
  );
}

type CtaProps = ComponentProps<typeof Link> & {
  variant?: "solid" | "outline";
};

export function Cta({ children, variant = "solid", className = "", ...props }: CtaProps) {
  const base =
    "group inline-flex items-center gap-3 px-6 py-3 u-label !tracking-[0.2em] transition-colors duration-200";
  const styles =
    variant === "solid"
      ? "bg-oxblood text-paper hover:bg-oxblood-deep"
      : "border border-current text-current hover:bg-current hover:text-paper";
  return (
    <Link className={`${base} ${styles} ${className}`} {...props}>
      {children}
      <ArrowRight
        className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
        strokeWidth={2.5}
      />
    </Link>
  );
}

export function Checker({ className = "" }: { className?: string }) {
  return (
    <div
      className={`u-checker h-2 w-full ${className}`}
      aria-hidden="true"
    />
  );
}
