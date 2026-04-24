import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "informative" | "positive" | "critical" | "warning";

export interface AlertProps {
  tone?: Tone;
  title?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/* Inline alert — sits in the page flow (unlike Toast which is global).
   Used for things like the manual-credit success/error notice in
   /admin/credits, or inline form-level guidance. */
const toneClass: Record<Tone, string> = {
  neutral: "bg-bg-neutral-weak text-text-neutral border-border-muted",
  informative: "bg-bg-neutral-weak text-text-informative border-border-muted",
  positive: "bg-bg-positive-weak text-text-positive border-border-muted",
  critical: "bg-bg-brand-weak text-text-critical border-border-muted",
  warning: "bg-bg-neutral-weak text-text-neutral border-border-muted",
};

export function Alert({
  tone = "neutral",
  title,
  children,
  icon,
  action,
  className,
}: AlertProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg border text-sm",
        toneClass[tone],
        className,
      )}
    >
      {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium leading-tight">{title}</p>}
        <div className={cn("leading-snug", title && "mt-1 text-text-neutral-muted")}>
          {children}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
