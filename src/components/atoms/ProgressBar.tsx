import { cn } from "@/lib/cn";

type Tone = "brand" | "neutral";

export interface ProgressBarProps {
  /** 0–100. Omit (or pass undefined) for an indeterminate animation. */
  value?: number;
  tone?: Tone;
  className?: string;
  "aria-label"?: string;
}

const trackToneClass: Record<Tone, string> = {
  brand: "bg-bg-brand-weak",
  neutral: "bg-bg-neutral-muted",
};

const fillToneClass: Record<Tone, string> = {
  brand: "bg-bg-brand-solid",
  neutral: "bg-bg-neutral-solid",
};

export function ProgressBar({ value, tone = "brand", className, ...aria }: ProgressBarProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-label={aria["aria-label"] ?? "진행률"}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-pill", trackToneClass[tone], className)}
    >
      {indeterminate ? (
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-1/3 rounded-pill",
            fillToneClass[tone],
            "animate-[progress-indeterminate_1.4s_ease-in-out_infinite]",
          )}
        />
      ) : (
        <span
          className={cn("block h-full rounded-pill transition-[width] duration-300", fillToneClass[tone])}
          style={{ width: `${clamped}%` }}
        />
      )}
      <style>{`
        @keyframes progress-indeterminate {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
