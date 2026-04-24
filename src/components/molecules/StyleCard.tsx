"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/atoms/Avatar";

export interface StyleCardItem {
  id: number;
  href: string;
  imageUrl: string;
  userName: string;
  userProfile?: string | null;
  likesCount: number;
  itemNames?: string[];
}

export interface StyleCardProps {
  item: StyleCardItem;
  className?: string;
}

/* Pinterest-style natural-aspect card.
   Image keeps its native ratio (block w-full h-auto), so the card's height
   is driven by the image. The wrapper div carries the bottom margin and
   break-inside-avoid hint that CSS columns masonry needs. Hover surfaces
   the meta overlay; mobile shows a tiny persistent footer because there's
   no hover on touch. */
export function StyleCard({ item, className }: StyleCardProps) {
  const { href, imageUrl, userName, userProfile, likesCount, itemNames = [] } = item;

  return (
    <div className={cn("mb-1 sm:mb-1.5 break-inside-avoid", className)}>
      <Link
        href={href}
        className="group relative block no-underline overflow-hidden bg-bg-neutral-weak"
      >
        {/* Natural-aspect image — drives card height, fills cell width */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`${userName}님의 스타일`}
          className="block w-full h-auto"
          loading="lazy"
        />

        {/* Hover overlay (desktop) — gradient + meta */}
        <div
          className="absolute inset-0 hidden sm:flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(transparent 30%, rgba(0,0,0,0.55))" }}
        >
          {itemNames.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {itemNames.slice(0, 3).map((name, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-tag text-text-neutral"
                  style={{ background: "rgba(255,255,255,0.92)" }}
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-text-inverted">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar name={userName} src={userProfile} size="xs" />
              <span className="text-sm font-medium truncate">{userName}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm shrink-0">
              <svg
                width="14" height="14" viewBox="0 0 24 24"
                fill={likesCount > 0 ? "currentColor" : "none"}
                stroke="currentColor" strokeWidth="2"
                className={likesCount > 0 ? "text-text-brand" : ""}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likesCount}
            </span>
          </div>
        </div>

        {/* Mobile-only persistent footer */}
        <div
          className="absolute inset-x-0 bottom-0 sm:hidden p-3 pt-10"
          style={{ background: "linear-gradient(transparent 0%, rgba(0,0,0,0.55))" }}
        >
          <div className="flex items-center justify-between text-text-inverted">
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar name={userName} src={userProfile} size="xs" />
              <span className="text-xs font-medium truncate">{userName}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs shrink-0">
              <svg
                width="12" height="12" viewBox="0 0 24 24"
                fill={likesCount > 0 ? "currentColor" : "none"}
                stroke="currentColor" strokeWidth="2"
                className={likesCount > 0 ? "text-text-brand" : ""}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likesCount}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
