import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EventTone = "neutral" | "brand" | "positive" | "critical" | "informative" | "magic";

export interface ActivityItem {
  key: string;
  /** Short label inside the colored badge (e.g. 가입 / 스타일 / 피팅 / 충전). */
  eventLabel: ReactNode;
  /** Tone for the badge — maps to one of the semantic color roles. */
  eventTone?: EventTone;
  /** Bold subject for the row (typically the user name). */
  actor: ReactNode;
  /** Additional context after the actor (e.g. "원피스 스타일을 업로드"). */
  detail?: ReactNode;
  /** Pre-formatted timestamp text (caller decides locale/format). */
  timestamp: ReactNode;
}

export interface ActivityFeedProps {
  items: ReadonlyArray<ActivityItem>;
  emptyMessage?: ReactNode;
  className?: string;
}

const eventToneClass: Record<EventTone, string> = {
  neutral: "bg-bg-neutral-weak text-text-neutral-muted",
  brand: "bg-bg-brand-weak text-text-brand",
  positive: "bg-bg-positive-weak text-text-positive",
  critical: "bg-bg-brand-weak text-text-critical",
  informative: "bg-bg-neutral-weak text-text-informative",
  magic: "bg-bg-neutral-weak text-text-magic",
};

export function ActivityFeed({ items, emptyMessage, className }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12 rounded-card border border-border-muted", className)}>
        <p className="text-sm text-text-neutral-muted">{emptyMessage ?? "활동 내역이 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-card border border-border-muted", className)}>
      {items.map((it, i) => (
        <div
          key={it.key}
          className={cn(
            "flex items-center gap-3 px-5 py-3.5",
            i > 0 && "border-t border-border-muted",
          )}
        >
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 shrink-0 rounded-tag",
              eventToneClass[it.eventTone ?? "neutral"],
            )}
          >
            {it.eventLabel}
          </span>
          <span className="text-sm flex-1 min-w-0 truncate text-text-neutral">
            <strong>{it.actor}</strong>
            {it.detail && (
              <span className="text-text-neutral-muted"> &middot; {it.detail}</span>
            )}
          </span>
          <span className="text-xs shrink-0 text-text-neutral-subtle">{it.timestamp}</span>
        </div>
      ))}
    </div>
  );
}
