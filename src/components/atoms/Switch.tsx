"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onChange, label, description, className, disabled, ...rest },
  ref,
) {
  const button = (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center w-10 h-6 px-0.5 rounded-full transition-colors cursor-pointer shrink-0",
        "outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
        checked ? "bg-bg-brand-solid" : "bg-bg-neutral-muted",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "block w-5 h-5 rounded-full bg-bg-floating shadow-card transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );

  if (!label && !description) return button;

  return (
    <div className={cn("flex items-start gap-3", disabled && "opacity-60")}>
      <div className="flex flex-col gap-0.5">
        {label && <span className="text-sm font-medium text-text-neutral leading-tight">{label}</span>}
        {description && (
          <span className="text-xs text-text-neutral-muted leading-snug">{description}</span>
        )}
      </div>
      <div className="ml-auto">{button}</div>
    </div>
  );
});
