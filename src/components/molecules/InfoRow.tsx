import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InfoRowProps {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-2 text-sm", className)}>
      <span className="text-text-neutral-muted">{label}</span>
      <span className="font-medium text-text-neutral">{value}</span>
    </div>
  );
}
