"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-bg-brand-solid text-text-inverted hover:bg-bg-brand-solid-pressed active:bg-bg-brand-solid-pressed disabled:bg-bg-neutral-muted disabled:text-text-neutral-subtle",
  secondary:
    "bg-bg-neutral-weak text-text-neutral hover:bg-bg-neutral-muted active:bg-bg-neutral-muted disabled:bg-bg-neutral-weak disabled:text-text-neutral-subtle",
  ghost:
    "bg-transparent text-text-neutral border border-border-muted hover:bg-bg-neutral-weak disabled:text-text-neutral-subtle disabled:border-border-subtle",
  danger:
    "bg-transparent text-text-critical border border-border-brand hover:bg-bg-brand-weak disabled:text-text-neutral-subtle disabled:border-border-subtle",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-pill transition-colors cursor-pointer disabled:cursor-not-allowed",
        "outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
        variantClass[variant],
        sizeClass[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading && <Spinner size={size === "lg" ? "md" : "sm"} tone="inverted" />}
      {children}
    </button>
  );
});
