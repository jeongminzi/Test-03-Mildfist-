import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Weight = 300 | 400 | 500 | 600 | 700;

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Material Symbol identifier, e.g. "favorite" / "search" / "close". */
  name: string;
  /** Pixel size (also drives optical-size axis). Default 20. */
  size?: number;
  /** Stroke weight (300 thin – 700 bold). Default 400. */
  weight?: Weight;
  /** Filled vs outlined glyph. Default false (outlined). */
  filled?: boolean;
  /** Accessible name. Omit for purely decorative icons (will be aria-hidden). */
  "aria-label"?: string;
}

/* Material Symbols Rounded — glyph delivered as a font ligature so the
   span text IS the icon name. Color follows currentColor (use text-text-*).
   Sizing is set both as font-size and as the font's opsz axis so the icon
   draws correctly at any pixel size. */
export function Icon({
  name,
  size = 20,
  weight = 400,
  filled = false,
  className,
  style,
  "aria-label": ariaLabel,
  ...rest
}: IconProps) {
  return (
    <span
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("material-symbols-rounded select-none", className)}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}
