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
  /* Tailwind's `columns-[…]` was being parsed as column-count, not
     column-width, so wide monitors stayed at 3 columns. Use the
     explicit CSS property via arbitrary-property syntax instead:
       md:[column-width:14rem] → browser packs as many ~224px columns
       as the viewport allows, automatically.
     Mobile and sm keep explicit counts so small widths get at least 2/3.

     Expected packing (after subtracting page padding ~80px):
       768   md   ~3 cols   ~218px
       1024  lg   ~4 cols   ~221px
       1280  xl   ~5 cols   ~224px
       1536  2xl  ~6 cols   ~225px
       1900       ~7-8 cols ~228px
       2560       ~10 cols  ~228px */
  return (
    <div
      className={cn(
        "columns-2 sm:columns-3 md:[column-width:14rem]",
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
