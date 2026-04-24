"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: Size;
  invalid?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = "md", invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "block w-full rounded-control bg-bg-default text-text-neutral placeholder:text-text-neutral-subtle outline-none border transition-colors",
        invalid
          ? "border-border-brand focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
          : "border-border-muted focus:border-border-solid focus:ring-2 focus:ring-border-solid/20",
        "disabled:bg-bg-neutral-weak disabled:text-text-neutral-subtle disabled:cursor-not-allowed",
        sizeClass[inputSize],
        className,
      )}
      {...rest}
    />
  );
});
