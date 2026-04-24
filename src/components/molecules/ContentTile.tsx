import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LikeButton } from "./LikeButton";

export interface ContentTileProps {
  imageUrl: string;
  imageAlt: string;
  authorName: ReactNode;
  /** Pre-formatted timestamp text. */
  timestamp?: ReactNode;
  likesCount: number;
  /** When true, the image is dimmed and a "숨김 처리됨" banner is overlayed. */
  hidden?: boolean;
  /** One or more action buttons rendered at the bottom of the tile. */
  actions?: ReactNode;
  className?: string;
}

/* Admin content thumbnail tile — used in /admin/contents to list every
   uploaded style with hide / unhide / delete actions. The hidden state
   dims the whole tile and stamps a status overlay so it's obvious at
   a glance which items are no longer visible to users. */
export function ContentTile({
  imageUrl,
  imageAlt,
  authorName,
  timestamp,
  likesCount,
  hidden = false,
  actions,
  className,
}: ContentTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-card border border-border-muted overflow-hidden bg-bg-floating",
        hidden && "opacity-50",
        className,
      )}
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-[140px] object-cover bg-bg-neutral-weak"
        />
        {hidden && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-overlay">
            <span className="text-xs font-medium text-text-inverted">숨김 처리됨</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-neutral truncate">{authorName}</span>
          <LikeButton liked={likesCount > 0} count={likesCount} />
        </div>
        {timestamp && (
          <p className="text-xs mb-3 text-text-neutral-subtle">{timestamp}</p>
        )}
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
