"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, disabled, ...rest },
  ref,
) {
  const input = (
    <input
      ref={ref}
      id={id}
      type="checkbox"
      disabled={disabled}
      className={cn(
        "peer appearance-none w-4 h-4 rounded-sm border border-border-solid bg-bg-default shrink-0 cursor-pointer",
        "checked:bg-bg-brand-solid checked:border-border-brand",
        "outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
        "disabled:cursor-not-allowed disabled:bg-bg-neutral-weak disabled:border-border-muted",
        className,
      )}
      {...rest}
    />
  );

  if (!label && !description) return input;

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-start gap-2 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span className="relative inline-flex items-center mt-0.5">
        {input}
        {/* checkmark drawn over the input via peer-checked */}
        <svg
          className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-text-inverted opacity-0 peer-checked:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        {label && <span className="text-sm text-text-neutral leading-tight">{label}</span>}
        {description && (
          <span className="text-xs text-text-neutral-muted leading-snug">{description}</span>
        )}
      </span>
    </label>
  );
});
