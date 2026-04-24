import { cn } from "@/lib/cn";

type Shape = "rect" | "circle" | "text";

export interface SkeletonProps {
  shape?: Shape;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const shapeClass: Record<Shape, string> = {
  rect: "rounded-md",
  circle: "rounded-full",
  text: "rounded-sm h-3",
};

export function Skeleton({ shape = "rect", className, width, height }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("block bg-bg-neutral-muted animate-pulse", shapeClass[shape], className)}
      style={{ width, height }}
    />
  );
}
