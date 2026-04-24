import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  delta?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, delta, className }: StatCardProps) {
  return (
    <Card padding="lg" bordered className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-neutral-muted">{label}</span>
        {icon && <span className="text-text-neutral-subtle">{icon}</span>}
      </div>
      <p className="text-3xl font-semibold text-text-neutral tracking-tight">{value}</p>
      {delta && <span className="text-xs text-text-neutral-muted">{delta}</span>}
    </Card>
  );
}
