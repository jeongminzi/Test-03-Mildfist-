import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
}

/* Pinterest-style CSS columns masonry — cards keep their natural aspect
   ratio so column packing produces the staggered, varied-height look
   the reference shows. Column count steps responsively:
     <640        2 cols
     ≥640 sm    3 cols
     ≥1024 lg   4 cols
     ≥1280 xl   5 cols
     ≥1536 2xl  6 cols
   gap-1 / 1.5 keeps cards densely packed. Outer 4 corners are rounded
   via overflow-hidden + rounded-2xl on the wrapper. */
export function StyleGrid({ items, className }: StyleGridProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl", className)}>
      <div
        className={cn(
          "columns-2 sm:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6",
          "gap-1 sm:gap-1.5 [column-fill:balance]",
        )}
      >
        {items.map((item) => (
          <StyleCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
