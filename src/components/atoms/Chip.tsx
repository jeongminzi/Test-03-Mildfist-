"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leadingIcon?: ReactNode;
}

export function Chip({ selected, leadingIcon, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-pill transition-colors cursor-pointer",
        selected
          ? "bg-bg-brand-solid text-text-inverted"
          : "bg-bg-neutral-muted text-text-neutral hover:bg-bg-neutral-weak",
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
    </button>
  );
}
