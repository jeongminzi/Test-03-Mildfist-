import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Padding = "none" | "sm" | "md" | "lg";
type Surface = "default" | "weak";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: Padding;
  surface?: Surface;
  bordered?: boolean;
  shadow?: boolean;
  children: ReactNode;
}

const paddingClass: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const surfaceClass: Record<Surface, string> = {
  default: "bg-bg-floating",
  weak: "bg-bg-neutral-weak",
};

export function Card({
  padding = "md",
  surface = "default",
  bordered = false,
  shadow = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card",
        surfaceClass[surface],
        paddingClass[padding],
        bordered && "border border-border-muted",
        shadow && "shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
