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
  /** Optional analyzed item names — surfaced on desktop hover only. */
  itemNames?: string[];
}

export interface StyleCardProps {
  item: StyleCardItem;
  className?: string;
}

/* Pinterest-style natural-aspect card.
   The image keeps its native ratio (no cropping). Card surface is the image
   itself. Author + like count sit *outside* the card, beneath it, so the
   image stays the focus and the layout stays calm. Hover surfaces a minimal
   overlay (dim + analyzed item tags + heart pill, top-right) — Midjourney's
   light touch, not a heavy gradient. */
export function StyleCard({ item, className }: StyleCardProps) {
  const { href, imageUrl, userName, userProfile, likesCount, itemNames = [] } = item;

  return (
    <div className={cn("mb-4 sm:mb-6 break-inside-avoid", className)}>
      <Link
        href={href}
        className="group block no-underline relative overflow-hidden rounded-card bg-bg-neutral-weak"
      >
        {/* Natural-aspect image — drives the card height */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`${userName}님의 스타일`}
          className="block w-full h-auto"
          loading="lazy"
        />

        {/* Top-right like pill — always visible (Pinterest "save" pattern) */}
        <span
          className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-pill text-xs font-medium bg-bg-floating/90 backdrop-blur-sm text-text-neutral shadow-card"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={likesCount > 0 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={likesCount > 0 ? "text-text-brand" : ""}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likesCount}
        </span>

        {/* Hover overlay — desktop only, minimal */}
        {itemNames.length > 0 && (
          <div
            className="absolute inset-x-0 bottom-0 hidden sm:flex flex-wrap gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.55))" }}
          >
            {itemNames.slice(0, 3).map((name, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-tag text-text-neutral"
                style={{ background: "rgba(255,255,255,0.92)" }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Outside-the-card meta (Pinterest pattern) */}
      <div className="mt-1.5 px-1 flex items-center gap-1.5 min-w-0">
        <Avatar name={userName} src={userProfile} size="xs" />
        <span className="text-xs text-text-neutral-muted truncate">{userName}</span>
      </div>
    </div>
  );
}
