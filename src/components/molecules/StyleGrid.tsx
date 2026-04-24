import { cn } from "@/lib/cn";
import { StyleCard, StyleCardItem, StyleCardVariant } from "./StyleCard";

export interface StyleGridProps {
  items: ReadonlyArray<StyleCardItem>;
  className?: string;
  variantAt?: (index: number) => StyleCardVariant;
}

/* Bento pattern, deterministic from index so SSR stays stable.
   Tuned to feel closer to the Midjourney explore reference: tall
   (1×2) accents are frequent, with occasional wide and feature
   accents. Index 0 anchors the page with a feature. */
function defaultVariantAt(index: number): StyleCardVariant {
  if (index === 0) return "feature";
  if (index % 11 === 0) return "feature";
  const m = index % 7;
  if (m === 1 || m === 4) return "tall";
  if (m === 6) return "wide";
  return "regular";
}

export function StyleGrid({ items, className, variantAt = defaultVariantAt }: StyleGridProps) {
  /* Tight Bento grid:
       2 cols on mobile (variants collapse to 1×1 via StyleCard)
       3 → 4 → 5 cols at sm / lg / 2xl
     gap-1 (4px) keeps cards densely packed like the reference image.
     auto-rows fixed so tall/feature get a real 2-row footprint. */
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
        "[grid-auto-flow:dense] [grid-auto-rows:200px] sm:[grid-auto-rows:240px]",
        "gap-1 sm:gap-1.5",
        className,
      )}
    >
      {items.map((item, i) => (
        <StyleCard key={item.id} item={item} variant={variantAt(i)} />
      ))}
    </div>
  );
}
