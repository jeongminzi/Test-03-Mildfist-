"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  inputSize?: Size;
  invalid?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "h-8 pl-3 pr-8 text-xs",
  md: "h-10 pl-4 pr-10 text-sm",
  lg: "h-12 pl-5 pr-12 text-base",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { inputSize = "md", invalid, className, children, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "block w-full appearance-none rounded-control bg-bg-default text-text-neutral outline-none border transition-colors cursor-pointer",
          invalid
            ? "border-border-brand focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
            : "border-border-muted focus:border-border-solid focus:ring-2 focus:ring-border-solid/20",
          "disabled:bg-bg-neutral-weak disabled:text-text-neutral-subtle disabled:cursor-not-allowed",
          sizeClass[inputSize],
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-neutral-subtle"
        width={inputSize === "sm" ? 12 : 14}
        height={inputSize === "sm" ? 12 : 14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
});
