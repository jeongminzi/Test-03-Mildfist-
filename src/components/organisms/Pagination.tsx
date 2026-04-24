"use client";

import { cn } from "@/lib/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav className={cn("flex items-center justify-center gap-3 py-4", className)}>
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1.5 text-sm font-medium rounded-control bg-bg-neutral-weak text-text-neutral hover:bg-bg-neutral-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        이전
      </button>
      <span className="text-sm text-text-neutral-muted">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1.5 text-sm font-medium rounded-control bg-bg-neutral-weak text-text-neutral hover:bg-bg-neutral-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        다음
      </button>
    </nav>
  );
}
