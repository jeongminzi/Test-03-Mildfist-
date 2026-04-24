"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { DropdownMenu, DropdownMenuItem } from "@/components/molecules/DropdownMenu";
import { SearchBar } from "@/components/molecules/SearchBar";
import { useToast } from "@/components/molecules/Toast";
import { cn } from "@/lib/cn";

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="text-text-neutral-subtle">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FittingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v12" />
    <path d="M18 9a3 3 0 0 1-3 3H6" />
  </svg>
);

const AdminIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const PRIMARY_NAV: { href: string; label: string }[] = [
  { href: "/analyze", label: "아이템 인식" },
  { href: "/fitting", label: "가상 피팅" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const toast = useToast();

  const items: DropdownMenuItem[] = user
    ? [
        { key: "mypage", label: "마이페이지", icon: <UserIcon />, href: "/mypage" },
        { key: "analyze", label: "아이템 인식", icon: <SearchIcon />, href: "/analyze" },
        { key: "fitting", label: "가상 피팅", icon: <FittingIcon />, href: "/fitting" },
        ...(user.is_admin === 1
          ? [{ key: "admin", label: "관리자", icon: <AdminIcon />, href: "/admin" } as DropdownMenuItem]
          : []),
        { key: "logout", label: "로그아웃", icon: <LogoutIcon />, destructive: true, onSelect: logout },
      ]
    : [];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 flex items-center gap-6 px-4 sm:px-6 py-3 bg-bg-default border-b border-border-muted">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
        <div className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-bg-brand-solid">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v12" />
            <path d="M18 9a3 3 0 0 1-3 3H6" />
            <path d="m10 8 -4 4 4 4" />
          </svg>
        </div>
        <span className="text-lg font-semibold tracking-tight text-text-neutral hidden sm:inline">
          MildFist
        </span>
      </Link>

      {/* Center: Primary nav (desktop only) */}
      {user && (
        <nav className="hidden md:flex items-center gap-1">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "no-underline px-3 py-1.5 text-sm font-medium rounded-pill transition-colors",
                  active
                    ? "bg-bg-brand-weak text-text-brand"
                    : "text-text-neutral-muted hover:bg-bg-neutral-weak hover:text-text-neutral",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Search — sm and up only. Submitting falls back to a toast until the
          search backend exists, so the bar is interactive (not the previous
          readonly stub) but doesn't pretend to query anything. */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const q = String(data.get("q") || "").trim();
          if (!q) return;
          toast.show(`"${q}" 검색은 곧 지원됩니다`, { tone: "informative" });
        }}
        className="flex-1 max-w-md hidden sm:block"
      >
        <SearchBar name="q" placeholder="스타일 검색..." />
      </form>

      {/* Right: Auth */}
      <div className="flex items-center gap-3 shrink-0">
        {user ? (
          <DropdownMenu
            align="end"
            trigger={
              <span className="flex items-center gap-2">
                <Avatar name={user.name} size="sm" />
                <span className="text-sm font-medium text-text-neutral hidden sm:inline">{user.name}</span>
                <ChevronDown />
              </span>
            }
            items={items}
          />
        ) : (
          <Link href="/login" className="no-underline">
            <Button size="sm">로그인</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
