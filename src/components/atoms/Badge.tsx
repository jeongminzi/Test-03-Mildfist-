import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "brand" | "positive" | "critical" | "informative" | "magic";
type Size = "sm" | "md";

export interface BadgeProps {
  tone?: Tone;
  size?: Size;
  children: ReactNode;
  className?: string;
}

const toneClass: Record<Tone, string> = {
  neutral: "bg-bg-neutral-muted text-text-neutral",
  brand: "bg-bg-brand-solid text-text-inverted",
  positive: "bg-bg-positive-weak text-text-positive",
  critical: "bg-bg-brand-weak text-text-critical",
  informative: "bg-bg-neutral-weak text-text-informative",
  magic: "bg-bg-neutral-weak text-text-magic",
};

const sizeClass: Record<Size, string> = {
  sm: "h-5 px-2 text-[11px]",
  md: "h-6 px-2.5 text-xs",
};

export function Badge({ tone = "neutral", size = "md", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-tag whitespace-nowrap",
        toneClass[tone],
        sizeClass[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
