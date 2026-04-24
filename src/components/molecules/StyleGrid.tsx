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
  /* Column ramp tuned so each breakpoint actually widens the card.
     Earlier we had 2→3→4 between sm (640) and md (768), which made cards
     shrink at md. New ramp adds one column only when the viewport gives
     it ~150px+ of extra space:
       <640      2 cols
       ≥640 sm   3 cols
       ≥1024 lg  4 cols
       ≥1280 xl  5 cols
       ≥1536 2xl 6 cols
     Card width stays roughly 180–240px across all breakpoints. */
  return (
    <div
      className={cn(
        "columns-2 sm:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6",
        "gap-3 sm:gap-4 [column-fill:balance]",
        className,
      )}
    >
      {items.map((item) => (
        <StyleCard key={item.id} item={item} />
      ))}
    </div>
  );
}
