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
  /* Column ramp tuned for "show me larger cards" — one step lazier than
     before so each card breathes more:
       <640      2 cols  → ~158px
       ≥640 sm   3 cols  → ~186px
       ≥1280 xl  4 cols  → ~290px
       ≥1536 2xl 5 cols  → ~284px
     md and lg keep the sm 3-column layout, which lets the card width
     grow continuously from ~186px (640) up to ~310px (just before xl)
     before another column is added. */
  return (
    <div
      className={cn(
        "columns-2 sm:columns-3 xl:columns-4 2xl:columns-5",
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
