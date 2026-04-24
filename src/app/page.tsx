"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { resizeAndConvertToBase64 } from "@/lib/image-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { SectionTitle } from "@/components/molecules/SectionTitle";
import { TabBar } from "@/components/molecules/TabBar";

interface StyleItem {
  id: number;
  user_id: number;
  image_url: string;
  analysis_json: string;
  likes_count: number;
  created_at: string;
  user_name: string;
  user_profile: string | null;
}

const fileToBase64 = resizeAndConvertToBase64;

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [styles, setStyles] = useState<StyleItem[]>([]);
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStyles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/styles?sort=${sort}&page=1`);
      const data = await res.json();
      setStyles(data.styles || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    fetchStyles();
  }, [fetchStyles]);

  const handleUpload = async (file: File) => {
    if (!user) {
      router.push("/login?redirect=/");
      return;
    }
    setUploading(true);
    try {
      const b64 = await fileToBase64(file);
      const res = await fetch("/api/styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64 }),
      });
      if (res.ok) {
        fetchStyles();
      }
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-bg-default">
      {/* Hero */}
      <div className="px-4 sm:px-6 pt-8 pb-6">
        <SectionTitle
          variant="headingWithSub"
          align="center"
          heading="AI 패션 스타일 피드"
          subtext="다양한 스타일을 탐색하고, AI 가상 피팅을 체험하세요"
        />
      </div>

      {/* Sort tabs */}
      <div className="px-4 sm:px-6">
        <TabBar
          items={[
            { key: "latest", label: "최신순" },
            { key: "popular", label: "인기순" },
          ]}
          value={sort}
          onChange={setSort}
        />
      </div>

      {/* Masonry grid */}
      <div className="flex-1 px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : styles.length === 0 ? (
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            }
            title="아직 업로드된 스타일이 없습니다"
            description="첫 스타일을 올려서 다른 사용자들과 공유해 보세요."
            action={
              <Button
                size="lg"
                onClick={() => {
                  if (!user) {
                    router.push("/login?redirect=/");
                    return;
                  }
                  fileInputRef.current?.click();
                }}
              >
                스타일 올리기
              </Button>
            }
          />
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4" style={{ columnFill: "balance" }}>
            {styles.map((style) => {
              let items: { name: string }[] = [];
              try {
                const parsed = JSON.parse(style.analysis_json);
                items = parsed.items || [];
              } catch {
                // ignore
              }

              return (
                <Link
                  key={style.id}
                  href={`/style/${style.id}`}
                  className="block mb-4 break-inside-avoid no-underline group transition-transform hover:-translate-y-0.5"
                >
                  <div className="overflow-hidden relative rounded-card bg-bg-neutral-weak transition-shadow group-hover:shadow-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={style.image_url}
                      alt={`Style by ${style.user_name}`}
                      className="w-full object-cover min-h-[180px]"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3"
                      style={{
                        background:
                          "linear-gradient(transparent 40%, var(--bg-overlay-strong))",
                      }}
                    >
                      {items.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {items.slice(0, 3).map((item, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-tag text-text-neutral"
                              style={{ background: "rgba(255,255,255,0.85)" }}
                            >
                              {item.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 px-1 space-y-1">
                    {items.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:hidden">
                        {items.slice(0, 2).map((item, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded-tag bg-bg-neutral-weak text-text-neutral-muted"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={style.user_name} src={style.user_profile} size="xs" />
                        <span className="text-xs text-text-neutral">{style.user_name}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-text-neutral-subtle">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill={style.likes_count > 0 ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          className={style.likes_count > 0 ? "text-text-brand" : ""}
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {style.likes_count}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <div className="fixed bottom-8 right-6 sm:right-8 z-40">
        <Button
          onClick={() => {
            if (!user) {
              router.push("/login?redirect=/");
              return;
            }
            fileInputRef.current?.click();
          }}
          loading={uploading}
          size="lg"
          className="shadow-card"
        >
          {!uploading && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
          {uploading ? "업로드 중..." : "스타일 올리기"}
        </Button>
      </div>
    </div>
  );
}
