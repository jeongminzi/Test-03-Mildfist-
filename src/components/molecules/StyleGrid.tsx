import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem, StyleCardVariant } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
  /** Override the default Bento pattern (e.g. for storybook demos). */
  variantAt?: (index: number) => StyleCardVariant;
}

/* Bento-style pattern: deterministic from index so re-renders are stable.
   - feature (2×2): every 11th item (anchors big visual moments)
   - wide (2×1):    indices 3 and 14 inside each 17-item cycle
   - tall (1×2):    indices 6 and 9 inside each 17-item cycle
   - everything else stays regular (1×1)
   Mobile collapses all variants to 1×1 via StyleCard's responsive classes. */
function defaultVariantAt(index: number): StyleCardVariant {
  if (index % 11 === 0 && index !== 0) return "feature";
  if (index === 0) return "feature";
  const m = index % 17;
  if (m === 3 || m === 14) return "wide";
  if (m === 6 || m === 9) return "tall";
  return "regular";
}

export function StyleGrid({ items, className, variantAt = defaultVariantAt }: StyleGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
        "[grid-auto-flow:dense] [grid-auto-rows:200px] sm:[grid-auto-rows:220px]",
        className,
      )}
    >
      {items.map((item, i) => (
        <StyleCard key={item.id} item={item} variant={variantAt(i)} />
      ))}
    </div>
  );
}
