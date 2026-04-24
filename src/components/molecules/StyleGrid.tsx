import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem, StyleCardVariant } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
  variantAt?: (index: number) => StyleCardVariant;
}

/* Default keeps every card 1×1 so the grid stays perfectly uniform —
   no jagged trailing rows, no visual holes between tall and regular
   cards. Bento accents are still possible by passing a custom
   variantAt (e.g. for hero pages or campaign feeds). */
function defaultVariantAt(_index: number): StyleCardVariant {
  return "regular";
}

export function StyleGrid({ items, className, variantAt = defaultVariantAt }: StyleGridProps) {
  /* Tight Bento grid:
       2 cols on mobile (variants collapse to 1×1 via StyleCard)
       3 → 4 → 5 cols at sm / lg / 2xl
     gap-1 (4px) keeps cards densely packed like the reference image.
     auto-rows fixed so tall/feature get a real 2-row footprint. */
  /* If the data set is small, downgrade to a 1×1 grid that fits the count
     exactly, so the bottom row never leaves a gap.
       items ≤ 4   → cap at 2 cols (mobile already 2)
       items ≤ 9   → cap at 3 cols, force every card to regular 1×1
       items > 9   → full bento ramp + variant pattern (anchors + accents)
     For sparse modes, forcing every variant to "regular" guarantees every
     cell is occupied by an item — no half-empty trailing row. */
  const sparse = items.length <= 9;
  const verySparse = items.length <= 4;
  const effectiveVariantAt = sparse ? () => "regular" as StyleCardVariant : variantAt;

  return (
    <div className={cn("overflow-hidden rounded-2xl", className)}>
      <div
        className={cn(
          "grid",
          verySparse
            ? "grid-cols-2"
            : sparse
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
          "[grid-auto-flow:dense] [grid-auto-rows:200px] sm:[grid-auto-rows:240px]",
          "gap-1 sm:gap-1.5",
        )}
      >
        {items.map((item, i) => (
          <StyleCard key={item.id} item={item} variant={effectiveVariantAt(i)} />
        ))}
      </div>
    </div>
  );
}
