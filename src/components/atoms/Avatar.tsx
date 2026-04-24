import { cn } from "@/lib/cn";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: Size;
  className?: string;
}

const sizeClass: Record<Size, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover bg-bg-neutral-muted", sizeClass[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold bg-bg-neutral-muted text-text-neutral",
        sizeClass[size],
        className,
      )}
      aria-label={name}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
