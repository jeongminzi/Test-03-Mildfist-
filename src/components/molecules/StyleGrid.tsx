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
  /* From md up we switch from a fixed column count to a column-WIDTH
     constraint (CSS columns: 16rem). The browser then packs as many
     ~256px columns as the viewport can fit, so wide monitors fill out
     instead of leaving empty rails. Mobile and sm keep an explicit
     count to guarantee at least 2 / 3 columns at small widths.
       <640      columns-2          → ~158px
       ≥640 sm   columns-3          → ~186px
       ≥768 md   column-width:16rem → 3 cols at 768, 4 at 1024,
                                       5 at 1280, 6 at 1536, 7 at ~1800,
                                       8 at ~2050, … fills any monitor */
  return (
    <div
      className={cn(
        "columns-2 sm:columns-3 md:columns-[16rem]",
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
