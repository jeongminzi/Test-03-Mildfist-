"use client";

import { useState, useRef, useCallback } from "react";
import { resizeAndConvertToBase64 } from "@/lib/image-utils";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { Card } from "@/components/molecules/Card";
import { FileUploadArea } from "@/components/molecules/FileUploadArea";

interface FashionItem {
  category: string;
  name: string;
  color: string;
  style: string;
  description: string;
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

const fileToBase64 = resizeAndConvertToBase64;

export default function AnalyzePage() {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState<Record<number, boolean>>({});

  const handleFile = useCallback(async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setImage(await fileToBase64(file));
    setError(null);
    setItems([]);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "요청 실패");
      }
      const data = await res.json();
      setItems(data.items ?? data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, [image]);

  const handleSearch = useCallback(async (item: FashionItem, idx: number) => {
    setSearchLoading((prev) => ({ ...prev, [idx]: true }));
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      window.open(data.url, "_blank");
    } catch {
      const keyword = `${item.color} ${item.name} ${item.style}`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=shop`, "_blank");
    } finally {
      setSearchLoading((prev) => ({ ...prev, [idx]: false }));
    }
  }, []);

  return (
    <div className="flex-1 bg-bg-default">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-lg font-semibold text-text-neutral">패션 아이템 인식</h1>
            <p className="mt-1 text-sm text-text-neutral-muted">
              사진을 업로드하면 AI가 착용한 패션 아이템을 분석합니다.
            </p>
          </div>

          {preview ? (
            <div className="flex justify-center p-4 rounded-card bg-bg-neutral-weak">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="max-h-64 object-contain rounded-lg" />
            </div>
          ) : (
            <FileUploadArea
              onSelect={(files) => files[0] && handleFile(files[0])}
              hint="JPG, PNG, WEBP · 최대 10MB"
            />
          )}

          <Button onClick={handleAnalyze} disabled={!image} loading={loading} fullWidth>
            {loading ? "분석 중..." : "분석하기"}
          </Button>

          {error && <p className="text-sm text-text-critical">{error}</p>}

          {items.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-text-neutral">
                인식된 아이템 ({items.length})
              </h3>
              {items.map((item, i) => (
                <Card key={i} surface="weak" padding="md" className="flex items-start gap-4">
                  <span className="text-2xl leading-none mt-0.5">
                    {CATEGORY_EMOJI[item.category] ?? "👗"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-neutral">{item.name}</p>
                    <p className="text-xs mt-0.5 text-text-neutral-muted">
                      {item.color} · {item.style}
                    </p>
                    <p className="text-xs mt-1 text-text-neutral-subtle">{item.description}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearch(item, i)}
                    disabled={searchLoading[i]}
                  >
                    {searchLoading[i] ? (
                      <Spinner size="sm" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    )}
                    유사 상품
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
