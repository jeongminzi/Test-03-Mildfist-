"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "block w-full rounded-control bg-bg-default text-text-neutral placeholder:text-text-neutral-subtle outline-none border transition-colors px-4 py-2.5 text-sm resize-y",
        invalid
          ? "border-border-brand focus:border-border-brand focus:ring-2 focus:ring-border-brand/30"
          : "border-border-muted focus:border-border-solid focus:ring-2 focus:ring-border-solid/20",
        "disabled:bg-bg-neutral-weak disabled:text-text-neutral-subtle disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    />
  );
});
