import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";
type Tone = "brand" | "neutral" | "inverted";

export interface SpinnerProps {
  size?: Size;
  tone?: Tone;
  className?: string;
}

const sizeMap: Record<Size, number> = { sm: 16, md: 24, lg: 32 };
const toneClass: Record<Tone, string> = {
  brand: "text-text-brand",
  neutral: "text-text-neutral-muted",
  inverted: "text-text-inverted",
};

export function Spinner({ size = "md", tone = "brand", className }: SpinnerProps) {
  const px = sizeMap[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", toneClass[tone], className)}
      role="status"
      aria-label="로딩 중"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
