"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/cn";

type Placement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  placement?: Placement;
  children: ReactNode;
  className?: string;
}

const placementClass: Record<Placement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

/* CSS-only Tooltip — no portal. Hover or focus on the wrapper shows
   a small bubble. Good for icon button hints; not for rich content. */
export function Tooltip({ content, placement = "top", children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-50 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none",
            "bg-bg-neutral-solid text-text-inverted shadow-popover",
            placementClass[placement],
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
