"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface AdminNavItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  href: string;
}

export interface AdminSidebarProps {
  items: ReadonlyArray<AdminNavItem>;
  activeKey?: string;
  onNavigate?: (item: AdminNavItem) => void;
  className?: string;
}

export function AdminSidebar({ items, activeKey, onNavigate, className }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "w-60 shrink-0 h-full p-4 border-r border-border-muted bg-bg-floating",
        className,
      )}
    >
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const active = it.key === activeKey;
          return (
            <a
              key={it.key}
              href={it.href}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(it);
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors",
                active
                  ? "bg-bg-brand-weak text-text-brand"
                  : "text-text-neutral hover:bg-bg-neutral-weak",
              )}
            >
              {it.icon}
              {it.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
