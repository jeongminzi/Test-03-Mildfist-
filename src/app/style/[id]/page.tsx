"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { Card } from "@/components/molecules/Card";
import { ModalShell } from "@/components/organisms/ModalShell";

interface FashionItem {
  category: string;
  name: string;
  color: string;
  style: string;
  description: string;
}

interface StyleDetail {
  id: number;
  user_id: number;
  image_url: string;
  analysis_json: string;
  likes_count: number;
  created_at: string;
  user_name: string;
  user_profile: string | null;
}

const CATEGORY_EMOJI: Record<string, string> = {
  상의: "👕",
  하의: "👖",
  신발: "👟",
  모자: "🧢",
  가방: "👜",
  액세서리: "💍",
  헤어스타일: "💇",
};

const REPORT_REASONS = [
  "부적절한 이미지",
  "저작권 침해",
  "스팸/광고",
  "불쾌한 콘텐츠",
  "기타",
];

export default function StyleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [style, setStyle] = useState<StyleDetail | null>(null);
  const [items, setItems] = useState<FashionItem[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  useEffect(() => {
    async function fetchStyle() {
      try {
        const res = await fetch(`/api/styles/${id}`);
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setStyle(data.style);
        setLikesCount(data.style.likes_count);
        setLiked(!!data.liked);
        try {
          const parsed = JSON.parse(data.style.analysis_json);
          setItems(parsed.items || []);
        } catch {
          // ignore
        }
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    fetchStyle();
  }, [id, router]);

  const handleLike = async () => {
    if (!user) {
      router.push(`/login?redirect=/style/${id}`);
      return;
    }
    try {
      const res = await fetch(`/api/styles/${id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikesCount(data.likes_count);
      }
    } catch {
      // ignore
    }
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setReportSubmitting(true);
    try {
      const res = await fetch(`/api/styles/${id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
      if (res.ok) {
        setReportDone(true);
        setTimeout(() => {
          setReportModalOpen(false);
          setReportDone(false);
          setReportReason("");
        }, 1500);
      }
    } catch {
      // ignore
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleSearchItem = (item: FashionItem) => {
    const keyword = `${item.color} ${item.name} ${item.style}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=shop`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!style) return null;

  return (
    <div className="flex-1 bg-bg-default">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-6 no-underline text-text-neutral-muted hover:text-text-neutral"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          돌아가기
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="overflow-hidden rounded-card bg-bg-neutral-weak">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={style.image_url}
              alt={`Style by ${style.user_name}`}
              className="w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Avatar name={style.user_name} src={style.user_profile} size="md" />
              <div>
                <p className="text-sm font-medium text-text-neutral">{style.user_name}</p>
                <p className="text-xs text-text-neutral-subtle">
                  {new Date(style.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant={liked ? "primary" : "secondary"}
                onClick={handleLike}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likesCount}
              </Button>

              <Link href={`/fitting?style=${style.id}`} className="no-underline">
                <Button size="sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3v12" />
                    <path d="M18 9a3 3 0 0 1-3 3H6" />
                  </svg>
                  가상 피팅 해보기
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    router.push(`/login?redirect=/style/${id}`);
                    return;
                  }
                  setReportModalOpen(true);
                }}
                className="ml-auto inline-flex items-center gap-1 text-xs text-text-neutral-subtle bg-transparent border-none cursor-pointer hover:text-text-neutral-muted"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                신고
              </button>
            </div>

            {items.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-neutral">
                  인식된 아이템 ({items.length})
                </h3>
                {items.map((item, i) => (
                  <Card key={i} surface="weak" padding="sm" className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{CATEGORY_EMOJI[item.category] ?? "👗"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-neutral">{item.name}</p>
                      <p className="text-xs mt-0.5 text-text-neutral-muted">
                        {item.color} · {item.style}
                      </p>
                      <p className="text-xs mt-0.5 text-text-neutral-subtle">{item.description}</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => handleSearchItem(item)}>
                      유사 상품 보기
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ModalShell
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title={reportDone ? undefined : "스타일 신고"}
        footer={
          reportDone ? undefined : (
            <>
              <Button variant="secondary" onClick={() => setReportModalOpen(false)}>취소</Button>
              <Button onClick={handleReport} disabled={!reportReason} loading={reportSubmitting}>
                {reportSubmitting ? "처리 중..." : "신고하기"}
              </Button>
            </>
          )
        }
      >
        {reportDone ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-brand">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm font-medium text-text-neutral">신고가 접수되었습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {REPORT_REASONS.map((reason) => {
              const selected = reportReason === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setReportReason(reason)}
                  className={
                    "text-left text-sm p-3 rounded-lg border-none cursor-pointer transition-colors " +
                    (selected
                      ? "bg-bg-brand-solid text-text-inverted"
                      : "bg-bg-neutral-weak text-text-neutral hover:bg-bg-neutral-muted")
                  }
                >
                  {reason}
                </button>
              );
            })}
          </div>
        )}
      </ModalShell>
    </div>
  );
}
