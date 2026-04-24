"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { resizeAndConvertToBase64 } from "@/lib/image-utils";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/atoms/Button";
import { Chip } from "@/components/atoms/Chip";
import { Input } from "@/components/atoms/Input";
import { Spinner } from "@/components/atoms/Spinner";
import { Card } from "@/components/molecules/Card";
import { FileUploadArea } from "@/components/molecules/FileUploadArea";

const CATEGORY_EMOJI: Record<string, string> = {
  상의: "👕",
  하의: "👖",
  신발: "👟",
  모자: "🧢",
  가방: "👜",
  액세서리: "💍",
  헤어스타일: "💇",
};

interface FashionItem {
  category: string;
  name: string;
  color: string;
  style: string;
  description: string;
}

const fileToBase64 = resizeAndConvertToBase64;

export default function FittingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <FittingPageInner />
    </Suspense>
  );
}

function FittingPageInner() {
  const searchParams = useSearchParams();
  const styleId = searchParams.get("style");
  const { refresh } = useAuth();

  const [myImage, setMyImage] = useState<string | null>(null);
  const [myPreview, setMyPreview] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [stylePreview, setStylePreview] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<FashionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [fittingResult, setFittingResult] = useState<string | null>(null);
  const [fitLoading, setFitLoading] = useState(false);
  const [fitError, setFitError] = useState<string | null>(null);

  useEffect(() => {
    if (!styleId) return;
    async function loadStyle() {
      try {
        const res = await fetch(`/api/styles/${styleId}`);
        if (!res.ok) return;
        const data = await res.json();
        const style = data.style;
        setStylePreview(style.image_url);
        if (style.image_url.startsWith("data:")) {
          setStyleImage(style.image_url.split(",")[1]);
        }
        try {
          const parsed = JSON.parse(style.analysis_json);
          if (parsed.items) setRecognizedItems(parsed.items);
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    }
    loadStyle();
  }, [styleId]);

  const handleMyFile = useCallback(async (file: File) => {
    setMyPreview(URL.createObjectURL(file));
    setMyImage(await fileToBase64(file));
  }, []);

  const handleStyleFile = useCallback(async (file: File) => {
    setStylePreview(URL.createObjectURL(file));
    const b64 = await fileToBase64(file);
    setStyleImage(b64);
    try {
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64 }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecognizedItems(data.items ?? data);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleItem = useCallback((category: string, name: string) => {
    const label = `${category}: ${name}`;
    setSelectedItems((prev) =>
      prev.includes(label) ? prev.filter((n) => n !== label) : [...prev, label],
    );
  }, []);

  const handleFitting = useCallback(async () => {
    if (!myImage || !styleImage || selectedItems.length === 0) return;
    setFitLoading(true);
    setFitError(null);
    setFittingResult(null);

    try {
      const creditRes = await fetch("/api/credits/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1, description: "가상 피팅" }),
      });
      if (!creditRes.ok) {
        const err = await creditRes.json();
        setFitError(err.error || "크레딧이 부족합니다.");
        setFitLoading(false);
        return;
      }
    } catch {
      setFitError("크레딧 사용 중 오류가 발생했습니다.");
      setFitLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/fitting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ myImage, styleImage, selectedItems }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "요청 실패");
      }
      const data = await res.json();
      if (data.image) {
        setFittingResult(`data:image/png;base64,${data.image}`);
        try {
          await fetch("/api/fittings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              myImage,
              styleImage,
              resultImage: data.image,
              selectedItems,
            }),
          });
        } catch {
          // ignore
        }
        refresh();
      } else {
        throw new Error("이미지 생성 결과가 없습니다.");
      }
    } catch (err: unknown) {
      setFitError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setFitLoading(false);
    }
  }, [myImage, styleImage, selectedItems, refresh]);

  const disabled = !myImage || !styleImage || selectedItems.length === 0 || fitLoading;

  return (
    <div className="flex-1 bg-bg-default">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-lg font-semibold text-text-neutral">가상 피팅</h1>
            <p className="mt-1 text-sm text-text-neutral-muted">
              내 사진과 스타일 사진을 업로드한 후, 입혀볼 아이템을 선택하세요.
            </p>
          </div>

          {/* Two upload areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-text-neutral">내 사진</span>
              {myPreview ? (
                <div className="flex justify-center p-3 rounded-card bg-bg-neutral-weak">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={myPreview} alt="My photo" className="max-h-48 object-contain rounded-lg" />
                </div>
              ) : (
                <FileUploadArea
                  onSelect={(files) => files[0] && handleMyFile(files[0])}
                  hint="정면 전신 사진 권장"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-text-neutral">스타일 사진</span>
              {stylePreview ? (
                <div className="flex justify-center p-3 rounded-card bg-bg-neutral-weak">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stylePreview} alt="Style" className="max-h-48 object-contain rounded-lg" />
                </div>
              ) : (
                <FileUploadArea
                  onSelect={(files) => files[0] && handleStyleFile(files[0])}
                  hint="참고할 코디 사진"
                  disabled={!!styleId}
                />
              )}
            </div>
          </div>

          {/* Item selection */}
          {recognizedItems.length > 0 ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-text-neutral">피팅할 아이템 선택</span>
              <div className="flex flex-wrap gap-2">
                {recognizedItems.map((item, i) => {
                  const label = `${item.category}: ${item.name}`;
                  const selected = selectedItems.includes(label);
                  return (
                    <Chip
                      key={i}
                      selected={selected}
                      onClick={() => toggleItem(item.category, item.name)}
                    >
                      {CATEGORY_EMOJI[item.category] ?? "👗"} {item.name}
                    </Chip>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Card surface="weak" padding="md" className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" className="text-text-neutral-subtle shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs text-text-neutral-muted">
                  스타일 사진을 업로드하면 AI가 자동으로 아이템을 인식합니다. 직접 입력도 가능합니다.
                </p>
              </Card>
              <span className="text-xs font-medium text-text-neutral">피팅할 아이템 직접 입력</span>
              <Input
                placeholder="예: 검정 가죽 자켓, 흰색 티셔츠 (쉼표로 구분)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) setSelectedItems(val.split(",").map((s) => s.trim()).filter(Boolean));
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val) setSelectedItems(val.split(",").map((s) => s.trim()).filter(Boolean));
                }}
              />
            </div>
          )}

          <Button onClick={handleFitting} disabled={disabled} loading={fitLoading} fullWidth>
            {fitLoading ? "피팅 중... (최대 30초 소요)" : (
              <>
                피팅 시작
                <span className="text-xs opacity-70 ml-1">(1 크레딧)</span>
              </>
            )}
          </Button>

          {fitError && <p className="text-sm text-text-critical">{fitError}</p>}

          {fittingResult && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-sm font-semibold self-start text-text-neutral">피팅 결과</h3>
              <div className="w-full overflow-hidden rounded-card border border-border-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fittingResult} alt="피팅 결과" className="w-full object-contain" />
              </div>
              <a
                href={fittingResult}
                download="mildfist-fitting-result.png"
                className="inline-flex items-center gap-2 text-xs font-medium no-underline px-5 py-2 rounded-lg bg-bg-neutral-muted text-text-neutral hover:bg-bg-neutral-weak"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                이미지 다운로드
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
