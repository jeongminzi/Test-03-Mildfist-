"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/atoms/Avatar";

export type StyleCardVariant = "regular" | "wide" | "tall" | "feature";

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
  variant?: StyleCardVariant;
  className?: string;
}

/* On sm+ screens, variant decides the grid footprint. Mobile stays 1×1. */
const variantSpan: Record<StyleCardVariant, string> = {
  regular: "",
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  feature: "sm:col-span-2 sm:row-span-2",
};

export function StyleCard({ item, variant = "regular", className }: StyleCardProps) {
  const { href, imageUrl, userName, userProfile, likesCount, itemNames = [] } = item;
  const isFeature = variant === "feature";

  return (
    <Link
      href={href}
      className={cn(
        "group relative block no-underline overflow-hidden bg-bg-neutral-weak",
        variantSpan[variant],
        className,
      )}
    >
      {/* Image fills the entire cell */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={`${userName}님의 스타일`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Hover overlay (desktop) — gradient + meta */}
      <div
        className="absolute inset-0 hidden sm:flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(transparent 30%, rgba(0,0,0,0.55))" }}
      >
        {itemNames.length > 0 && (
          <div className={cn("flex flex-wrap gap-1", isFeature ? "mb-3" : "mb-2")}>
            {itemNames.slice(0, isFeature ? 5 : 3).map((name, i) => (
              <span
                key={i}
                className={cn(
                  "px-2 py-0.5 rounded-tag text-text-neutral",
                  isFeature ? "text-sm" : "text-xs",
                )}
                style={{ background: "rgba(255,255,255,0.92)" }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-text-inverted">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={userName} src={userProfile} size={isFeature ? "sm" : "xs"} />
            <span className={cn("font-medium truncate", isFeature ? "text-base" : "text-sm")}>
              {userName}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm shrink-0">
            <svg
              width={isFeature ? 18 : 14}
              height={isFeature ? 18 : 14}
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
        </div>
      </div>

      {/* Mobile-only persistent footer (touch has no hover) */}
      <div
        className="absolute inset-x-0 bottom-0 sm:hidden p-2 pt-8"
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
  );
}
