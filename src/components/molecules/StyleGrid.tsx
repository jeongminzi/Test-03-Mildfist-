import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
}

/* CSS columns masonry — Pinterest's natural-aspect packing.
   Column count steps: 2 → 3 → 4 → 5 → 6 (mobile → 2xl). Gap stays tight
   so the images dominate, like Midjourney's explore grid. The card itself
   handles its own bottom margin via mb-3/mb-4 + break-inside-avoid. */
export function StyleGrid({ items, className }: StyleGridProps) {
  /* Column ramp tuned so cards stay big without going absurdly wide on
     desktop monitors. Previous "extra-large" ramp held 3 columns until
     xl (1280), which made cards balloon past 300px on common 1400-1900
     viewports. Fix: jump to 4 columns at lg (1024) but keep lg's 4 cols
     all the way through xl (skip the xl step). 2xl finally adds a 5th.
       <640      2 cols  → ~158px
       ≥640 sm   3 cols  → ~186px
       ≥1024 lg  4 cols  → ~228px → grows to ~340px before 2xl
       ≥1536 2xl 5 cols  → ~284px → grows continuously after */
  return (
    <div
      className={cn(
        "columns-2 sm:columns-3 lg:columns-4 2xl:columns-5",
        "gap-4 sm:gap-6 [column-fill:balance]",
        className,
      )}
    >
      {items.map((item) => (
        <StyleCard key={item.id} item={item} />
      ))}
    </div>
  );
}
