import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
}

/* Pinterest-style CSS columns masonry — cards keep their natural aspect
   ratio so column packing produces the staggered, varied-height look
   the reference shows. Bigger cards: pull each breakpoint's column
   count down by one so each tile gets ~50% more width:
     <640        2 cols
     ≥640 sm    2 cols  → cards much wider on small tablets
     ≥1024 lg   3 cols
     ≥1280 xl   4 cols
     ≥1536 2xl  5 cols */
export function StyleGrid({ items, className }: StyleGridProps) {
  return (
    <div
      className={cn(
        "columns-2 lg:columns-3 xl:columns-4 2xl:columns-5",
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
