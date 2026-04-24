import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface StepperItem {
  key: string;
  label: ReactNode;
}

export interface StepperProps {
  steps: ReadonlyArray<StepperItem>;
  /** 0-based index of the current step. Steps before are "done", after are "todo". */
  currentIndex: number;
  className?: string;
}

export function Stepper({ steps, currentIndex, className }: StepperProps) {
  return (
    <ol className={cn("flex items-center w-full", className)} aria-label="진행 단계">
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const isLast = i === steps.length - 1;
        return (
          <li key={s.key} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex items-center gap-2">
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-colors",
                  done && "bg-bg-brand-solid text-text-inverted",
                  active && "bg-bg-brand-solid text-text-inverted",
                  !done && !active && "bg-bg-neutral-muted text-text-neutral-subtle",
                )}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:inline whitespace-nowrap",
                  active ? "text-text-neutral" : "text-text-neutral-subtle",
                )}
              >
                {s.label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  "flex-1 h-px mx-3 transition-colors",
                  done ? "bg-bg-brand-solid" : "bg-border-muted",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
