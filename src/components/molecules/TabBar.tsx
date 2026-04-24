"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem<T extends string = string> {
  key: T;
  label: ReactNode;
}

export interface TabBarProps<T extends string = string> {
  items: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (key: T) => void;
  className?: string;
}

/* Pill-style tabs.
   The previous version used a Material/iOS-style underline. This version is
   chip-shaped, with the active tab carrying a filled neutral pill and the
   inactive tabs reading as muted text only. Reads quieter, mirrors the
   login page's mode toggle, and keeps cleanly within crowded layouts. */
export function TabBar<T extends string = string>({
  items,
  value,
  onChange,
  className,
}: TabBarProps<T>) {
  return (
    <div role="tablist" className={cn("inline-flex items-center gap-1 flex-wrap", className)}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.key)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-pill transition-colors cursor-pointer",
              "outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default",
              active
                ? "bg-bg-neutral-muted text-text-neutral"
                : "bg-transparent text-text-neutral-muted hover:text-text-neutral hover:bg-bg-neutral-weak",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
