"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface DropdownMenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
  onSelect?: () => void;
  href?: string;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: ReadonlyArray<DropdownMenuItem>;
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenu({ trigger, items, align = "end", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-transparent border-none cursor-pointer p-0 m-0 inline-flex items-center"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute mt-2 py-2 min-w-[180px] bg-bg-floating rounded-card border border-border-muted shadow-popover z-50",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((it) => {
            const className = cn(
              "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left bg-transparent border-none cursor-pointer no-underline transition-colors hover:bg-bg-neutral-weak",
              it.destructive ? "text-text-critical" : "text-text-neutral",
            );
            const onClick = () => {
              setOpen(false);
              it.onSelect?.();
            };
            if (it.href) {
              return (
                <a key={it.key} href={it.href} className={className} onClick={onClick}>
                  {it.icon}
                  {it.label}
                </a>
              );
            }
            return (
              <button key={it.key} className={className} onClick={onClick}>
                {it.icon}
                {it.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
