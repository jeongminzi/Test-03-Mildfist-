"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface LikeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  liked: boolean;
  count?: number;
}

export function LikeButton({ liked, count, className, ...rest }: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={liked}
      className={cn(
        "inline-flex items-center gap-1 cursor-pointer text-xs",
        liked ? "text-text-brand" : "text-text-neutral-subtle hover:text-text-neutral-muted",
        className,
      )}
      {...rest}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {typeof count === "number" && <span>{count}</span>}
    </button>
  );
}
