"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { resizeAndConvertToBase64 } from "@/lib/image-utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/atoms/Button";
import { Chip } from "@/components/atoms/Chip";
import { Input } from "@/components/atoms/Input";
import { Spinner } from "@/components/atoms/Spinner";
import { Card } from "@/components/molecules/Card";
import { FileUploadArea } from "@/components/molecules/FileUploadArea";
import { Stepper } from "@/components/molecules/Stepper";

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

const FITTING_COST = 1;

function FittingPageInner() {
  const searchParams = useSearchParams();
  const styleId = searchParams.get("style");
  const { user, refresh } = useAuth();

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

  const credits = user?.credits ?? 0;
  const insufficientCredits = credits < FITTING_COST;
  const photosReady = !!myImage && !!styleImage;
  const itemsReady = photosReady && selectedItems.length > 0;
  const stepIndex = fittingResult ? 2 : itemsReady ? 2 : photosReady ? 1 : 0;
  const disabled = !photosReady || selectedItems.length === 0 || fitLoading || insufficientCredits;

  const retrySameInputs = () => {
    setFittingResult(null);
    setFitError(null);
  };

  const startOver = () => {
    setMyImage(null);
    setMyPreview(null);
    setStyleImage(null);
    setStylePreview(null);
    setRecognizedItems([]);
    setSelectedItems([]);
    setFittingResult(null);
    setFitError(null);
  };

  return (
    <div className="flex-1 bg-bg-default">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-neutral">가상 피팅</h1>
            <p className="mt-1 text-sm text-text-neutral-muted">
              내 사진과 스타일 사진을 업로드한 후, 입혀볼 아이템을 선택하세요.
            </p>
          </div>

          <Stepper
            steps={[
              { key: "upload", label: "사진 업로드" },
              { key: "items", label: "아이템 선택" },
              { key: "fit", label: "피팅" },
            ]}
            currentIndex={stepIndex}
          />

          {/* Credit balance — sets expectations before the user invests time */}
          <Card
            surface={insufficientCredits ? "default" : "weak"}
            padding="md"
            bordered={insufficientCredits}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-text-brand">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <p className="text-xs text-text-neutral-muted">보유 크레딧</p>
                <p className="text-sm font-semibold text-text-neutral">
                  {credits.toLocaleString()} 크레딧
                  <span className="ml-2 text-xs font-normal text-text-neutral-muted">
                    이번 피팅에 {FITTING_COST} 사용
                  </span>
                </p>
              </div>
            </div>
            {insufficientCredits && (
              <Link href="/mypage" className="no-underline">
                <Button size="sm">크레딧 충전</Button>
              </Link>
            )}
          </Card>

          {/* Two upload areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-text-neutral">내 사진</span>
              {myPreview ? (
                <div className="flex justify-center p-3 rounded-card bg-bg-neutral-weak">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={myPreview} alt="내 사진 미리보기" className="max-h-48 object-contain rounded-lg" />
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
                  <img src={stylePreview} alt="스타일 사진 미리보기" className="max-h-48 object-contain rounded-lg" />
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
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    const val = target.value.trim();
                    if (val) {
                      setSelectedItems(val.split(",").map((s) => s.trim()).filter(Boolean));
                      target.value = "";
                    }
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val) {
                    setSelectedItems(val.split(",").map((s) => s.trim()).filter(Boolean));
                    e.target.value = "";
                  }
                }}
              />
              {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedItems.map((item, i) => (
                    <Chip
                      key={i}
                      selected
                      onClick={() =>
                        setSelectedItems((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    >
                      {item} ✕
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          )}

          {!fittingResult && (
            <Button onClick={handleFitting} disabled={disabled} loading={fitLoading} fullWidth size="lg">
              {fitLoading ? "피팅 중... (최대 30초 소요)" : (
                <>
                  피팅 시작
                  <span className="text-xs opacity-70 ml-1">(1 크레딧)</span>
                </>
              )}
            </Button>
          )}

          {fitError && <p className="text-sm text-text-critical">{fitError}</p>}

          {fittingResult && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-bg-positive-weak text-text-positive">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold text-text-neutral">피팅 완료</h3>
              </div>
              <div className="w-full overflow-hidden rounded-card border border-border-muted bg-bg-neutral-weak">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fittingResult} alt="가상 피팅 결과 이미지" className="w-full object-contain" />
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={fittingResult}
                  download="mildfist-fitting-result.png"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 text-base font-medium no-underline rounded-pill bg-bg-brand-solid text-text-inverted hover:bg-bg-brand-solid-pressed transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-default"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  이미지 다운로드
                </a>
                <Button variant="secondary" size="lg" onClick={retrySameInputs}>
                  같은 입력으로 다시
                </Button>
                <Button variant="ghost" size="lg" onClick={startOver}>
                  처음부터
                </Button>
              </div>
              <p className="text-xs text-text-neutral-subtle">
                AI가 생성한 결과로 실제 착용 모습과 다를 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
