import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "captionAbove" | "headingOnly" | "headingWithSub";
type Align = "start" | "center";

export interface SectionTitleProps {
  caption?: string;
  heading: ReactNode;
  subtext?: ReactNode;
  variant?: Variant;
  align?: Align;
  className?: string;
}

export function SectionTitle({
  caption,
  heading,
  subtext,
  variant = "headingWithSub",
  align = "start",
  className,
}: SectionTitleProps) {
  const showCaption = variant === "captionAbove" && caption;
  const showSubtext = variant !== "headingOnly" && subtext;

  return (
    <div className={cn("flex flex-col gap-1", align === "center" && "items-center text-center", className)}>
      {showCaption && (
        <span className="text-xs font-medium text-text-neutral-muted uppercase tracking-wide">
          {caption}
        </span>
      )}
      <h2 className="text-xl sm:text-2xl font-semibold text-text-neutral tracking-tight">
        {heading}
      </h2>
      {showSubtext && <p className="text-sm text-text-neutral-muted">{subtext}</p>}
    </div>
  );
}
