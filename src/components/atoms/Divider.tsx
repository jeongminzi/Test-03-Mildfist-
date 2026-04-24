import { cn } from "@/lib/cn";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        "bg-border-muted",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className,
      )}
    />
  );
}
