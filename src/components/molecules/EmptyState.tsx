import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center gap-3 py-16", className)}>
      {icon && <div className="text-text-neutral-subtle">{icon}</div>}
      <p className="text-sm font-medium text-text-neutral">{title}</p>
      {description && <p className="text-sm text-text-neutral-muted max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
