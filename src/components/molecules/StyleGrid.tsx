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
   Each card carries its own rounded-2xl now (the wrapper-level rounding
   is gone), so individual cards read as separate tiles with breathing
   room between them. */
export function StyleGrid({ items, className }: StyleGridProps) {
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
