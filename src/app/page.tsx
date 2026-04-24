"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { resizeAndConvertToBase64 } from "@/lib/image-utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { SectionTitle } from "@/components/molecules/SectionTitle";
import { StyleGrid } from "@/components/molecules/StyleGrid";
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
      <div className="px-5 sm:px-8 pt-12 pb-8">
        <SectionTitle
          variant="headingWithSub"
          align="center"
          heading="AI 패션 스타일 피드"
          subtext="다양한 스타일을 탐색하고, AI 가상 피팅을 체험하세요"
        />
      </div>

      {/* Sort tabs */}
      <div className="px-5 sm:px-8">
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
      <div className="flex-1 px-5 sm:px-8 py-8">
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
          <StyleGrid
            items={styles.map((s) => {
              let itemNames: string[] = [];
              try {
                const parsed = JSON.parse(s.analysis_json);
                itemNames = (parsed.items || []).map((it: { name: string }) => it.name);
              } catch {
                // ignore malformed analysis json
              }
              return {
                id: s.id,
                href: `/style/${s.id}`,
                imageUrl: s.image_url,
                userName: s.user_name,
                userProfile: s.user_profile,
                likesCount: s.likes_count,
                itemNames,
              };
            })}
          />
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
