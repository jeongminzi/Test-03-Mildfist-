"use client";

import { ReactNode, useId } from "react";
import { cn } from "@/lib/cn";

export interface RadioOption<T extends string = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  name?: string;
  options: ReadonlyArray<RadioOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function RadioGroup<T extends string = string>({
  name,
  options,
  value,
  onChange,
  className,
}: RadioGroupProps<T>) {
  const generated = useId();
  const groupName = name ?? `radio-${generated}`;

  return (
    <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>
      {options.map((opt) => {
        const id = `${groupName}-${opt.value}`;
        const checked = opt.value === value;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              "inline-flex items-start gap-2 cursor-pointer select-none",
              opt.disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <span className="relative inline-flex items-center mt-0.5">
              <input
                id={id}
                type="radio"
                name={groupName}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                disabled={opt.disabled}
                className={cn(
                  "peer appearance-none w-4 h-4 rounded-full border border-border-solid bg-bg-default shrink-0 cursor-pointer",
                  "checked:border-border-brand",
                  "outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
                  "disabled:cursor-not-allowed",
                )}
              />
              <span className="pointer-events-none absolute inset-0 m-auto w-2 h-2 rounded-full bg-bg-brand-solid opacity-0 peer-checked:opacity-100" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm text-text-neutral leading-tight">{opt.label}</span>
              {opt.description && (
                <span className="text-xs text-text-neutral-muted leading-snug">{opt.description}</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
