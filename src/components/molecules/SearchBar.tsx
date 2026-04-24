"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { containerClassName, className, ...rest },
  ref,
) {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 bg-bg-neutral-weak rounded-pill", containerClassName)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="text-text-neutral-subtle shrink-0">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={ref}
        type="text"
        className={cn("flex-1 text-sm bg-transparent outline-none text-text-neutral placeholder:text-text-neutral-subtle", className)}
        {...rest}
      />
    </div>
  );
});
