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

export function TabBar<T extends string = string>({ items, value, onChange, className }: TabBarProps<T>) {
  return (
    <div role="tablist" className={cn("flex items-center gap-6 border-b border-border-muted", className)}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.key)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors cursor-pointer",
              active ? "text-text-brand" : "text-text-neutral-muted hover:text-text-neutral",
            )}
          >
            {it.label}
            {active && (
              <span className="absolute left-0 right-0 -bottom-px h-[2.5px] rounded-sm bg-bg-brand-solid" />
            )}
          </button>
        );
      })}
    </div>
  );
}
