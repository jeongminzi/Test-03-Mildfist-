import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ListItemProps {
  leading?: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function ListItem({ leading, primary, secondary, trailing, className }: ListItemProps) {
  return (
    <div className={cn("flex items-center gap-3 py-3", className)}>
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-neutral truncate">{primary}</p>
        {secondary && <p className="text-xs text-text-neutral-muted truncate mt-0.5">{secondary}</p>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
