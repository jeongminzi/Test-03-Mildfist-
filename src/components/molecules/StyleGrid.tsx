import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
}

/* Uniform 1×1 grid. Every cell is the same size, so no jagged trailing
   rows; the LAST card stretches its grid-column-end to -1 so the last
   row is always visually filled, regardless of how many items remain
   (1, 2, 3, …) or what the active column count is at the current
   breakpoint. Image inside each card uses object-cover. */
export function StyleGrid({ items, className }: StyleGridProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl", className)}>
      <div
        className={cn(
          "grid",
          /* Smaller cards: more columns at every breakpoint, shorter
             auto-rows. Cards now read ~160-200px tall instead of 240+. */
          "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8",
          "[grid-auto-rows:160px] sm:[grid-auto-rows:180px]",
          "gap-1 sm:gap-1.5",
          /* Last child stretches to the end of its row → no holes. */
          "[&>*:last-child]:[grid-column-end:-1]",
        )}
      >
        {items.map((item) => (
          <StyleCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
