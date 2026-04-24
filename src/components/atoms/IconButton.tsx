"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  "aria-label": string;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-bg-brand-solid text-text-inverted hover:bg-bg-brand-solid-pressed",
  ghost: "bg-transparent text-text-neutral hover:bg-bg-neutral-weak",
  danger: "bg-transparent text-text-critical hover:bg-bg-brand-weak",
};

const sizeClass: Record<Size, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "ghost", size = "md", className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
