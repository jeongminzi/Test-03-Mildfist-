import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
}

/* Pinterest-style CSS columns masonry.
   - Each card keeps its image's natural aspect ratio, so column packing
     produces the staggered, varied-height look the reference image shows.
   - column-width 14rem (≈224px) lets the browser pack as many columns as
     the viewport can fit — wide monitors fill out automatically without
     leaving empty rails on the right.
   - Mobile / sm get explicit columns-2 / columns-3 for legibility.
   - Wrapper rounds the four outer corners only (overflow-hidden +
     rounded-2xl); inner cards are square-edged so the bento canvas reads
     as one continuous surface. */
export function StyleGrid({ items, className }: StyleGridProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl", className)}>
      <div
        className={cn(
          "columns-2 sm:columns-3 md:[column-width:14rem]",
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
