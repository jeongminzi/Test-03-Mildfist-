"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/molecules/Card";
import { TabBar } from "@/components/molecules/TabBar";
import { EmptyState } from "@/components/molecules/EmptyState";
import { LikeButton } from "@/components/molecules/LikeButton";
import { ModalShell } from "@/components/organisms/ModalShell";

interface StyleItem {
  id: number;
  image_url: string;
  likes_count: number;
  created_at: string;
}

interface FittingItem {
  id: number;
  my_image: string | null;
  style_image: string | null;
  result_image: string | null;
  selected_items: string;
  created_at: string;
}

interface CreditTransaction {
  id: number;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

type Tab = "styles" | "fittings" | "credits";

const CHARGE_PACKAGES = [
  { amount: 10, price: "1,000" },
  { amount: 30, price: "3,000" },
  { amount: 50, price: "5,000" },
];

export default function MyPage() {
  const { user, logout, refresh } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("styles");
  const [myStyles, setMyStyles] = useState<StyleItem[]>([]);
  const [fittings, setFittings] = useState<FittingItem[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [charging, setCharging] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawText, setWithdrawText] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "styles") {
        const res = await fetch("/api/styles?sort=latest&page=1");
        const data = await res.json();
        setMyStyles(
          (data.styles || []).filter((s: { user_id: number }) => s.user_id === user?.id),
        );
      } else if (activeTab === "fittings") {
        const res = await fetch("/api/fittings");
        const data = await res.json();
        setFittings(data.fittings || []);
      } else if (activeTab === "credits") {
        const res = await fetch("/api/credits");
        const data = await res.json();
        setCredits(data.credits || 0);
        setTransactions(data.transactions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleCharge = async (amount: number) => {
    setCharging(true);
    try {
      const res = await fetch("/api/credits/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
        refresh();
        const txRes = await fetch("/api/credits");
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
    } catch {
      // ignore
    } finally {
      setCharging(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await fetch("/api/auth/withdraw", { method: "POST" });
      if (res.ok) {
        await logout();
        router.push("/");
      }
    } catch {
      // ignore
    } finally {
      setWithdrawing(false);
    }
  };

  const withdrawConfirmed = withdrawText.trim() === "탈퇴";

  if (!user) return null;

  const tabs = [
    { key: "styles" as const, label: "내 스타일" },
    { key: "fittings" as const, label: "피팅 히스토리" },
    { key: "credits" as const, label: "크레딧" },
  ];

  return (
    <div className="flex-1 bg-bg-default">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile section */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar name={user.name} size="xl" />
          <div>
            <h1 className="text-lg font-semibold text-text-neutral">{user.name}</h1>
            <p className="text-sm text-text-neutral-muted">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" className="text-text-brand">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-xs font-medium text-text-brand">{user.credits} 크레딧</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <TabBar items={tabs} value={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <>
            {activeTab === "styles" && (
              <div>
                {myStyles.length === 0 ? (
                  <EmptyState
                    icon={
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    }
                    title="아직 업로드한 스타일이 없습니다"
                    action={
                      <Link href="/" className="no-underline">
                        <Button size="sm">스타일 올리러 가기</Button>
                      </Link>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {myStyles.map((s) => (
                      <Link key={s.id} href={`/style/${s.id}`} className="block no-underline">
                        <div className="overflow-hidden rounded-card bg-bg-neutral-weak">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.image_url} alt="Style" className="w-full object-cover min-h-[140px]" />
                        </div>
                        <div className="mt-1.5 px-1">
                          <LikeButton liked={s.likes_count > 0} count={s.likes_count} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "fittings" && (
              <div>
                {fittings.length === 0 ? (
                  <EmptyState
                    icon={
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3v12" />
                        <path d="M18 9a3 3 0 0 1-3 3H6" />
                      </svg>
                    }
                    title="아직 피팅 기록이 없습니다"
                    action={
                      <Link href="/fitting" className="no-underline">
                        <Button size="sm">가상 피팅 해보기</Button>
                      </Link>
                    }
                  />
                ) : (
                  <div className="flex flex-col gap-4">
                    {fittings.map((f) => (
                      <Card key={f.id} surface="weak" padding="md" className="flex gap-4">
                        {f.result_image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={f.result_image}
                            alt="Fitting result"
                            className="w-20 h-20 object-cover rounded-lg shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-neutral">가상 피팅</p>
                          <p className="text-xs mt-0.5 text-text-neutral-muted">
                            {(() => {
                              try {
                                return JSON.parse(f.selected_items).join(", ");
                              } catch {
                                return "";
                              }
                            })()}
                          </p>
                          <p className="text-xs mt-1 text-text-neutral-subtle">
                            {new Date(f.created_at).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "credits" && (
              <div className="flex flex-col gap-6">
                <Card surface="weak" padding="lg" className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-neutral-muted">보유 크레딧</p>
                    <p className="text-2xl font-semibold mt-1 text-text-neutral">
                      {credits}
                      <span className="text-sm font-normal ml-1 text-text-neutral-muted">크레딧</span>
                    </p>
                  </div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" className="text-text-brand">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </Card>

                <div>
                  <h3 className="text-sm font-semibold mb-3 text-text-neutral">크레딧 충전</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {CHARGE_PACKAGES.map((pkg) => (
                      <button
                        key={pkg.amount}
                        type="button"
                        onClick={() => handleCharge(pkg.amount)}
                        disabled={charging}
                        className="flex flex-col items-center gap-1 p-4 rounded-card bg-bg-floating border border-border-muted hover:border-border-brand transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="text-lg font-semibold text-text-neutral">{pkg.amount}</span>
                        <span className="text-xs text-text-neutral-muted">크레딧</span>
                        <span className="text-xs font-medium mt-1 text-text-brand">{pkg.price}원</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-2 text-text-neutral-subtle">
                    프로토타입 데모 — 실제 결제는 이루어지지 않습니다.
                  </p>
                </div>

                {transactions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-text-neutral">이용 내역</h3>
                    <div className="flex flex-col gap-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-bg-neutral-weak"
                        >
                          <div>
                            <p className="text-sm text-text-neutral">{tx.description}</p>
                            <p className="text-xs mt-0.5 text-text-neutral-subtle">
                              {new Date(tx.created_at).toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                          <span
                            className={
                              "text-sm font-medium " +
                              (tx.amount > 0 ? "text-text-positive" : "text-text-critical")
                            }
                          >
                            {tx.amount > 0 ? "+" : ""}{tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Withdraw */}
        <div className="mt-12 pt-6 border-t border-border-muted">
          <button
            type="button"
            onClick={() => {
              setWithdrawText("");
              setWithdrawOpen(true);
            }}
            className="text-xs text-text-neutral-subtle bg-transparent border-none cursor-pointer"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      <ModalShell
        open={withdrawOpen}
        onClose={() => {
          if (!withdrawing) setWithdrawOpen(false);
        }}
        title="정말 탈퇴하시겠어요?"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setWithdrawOpen(false)}
              disabled={withdrawing}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleWithdraw}
              disabled={!withdrawConfirmed}
              loading={withdrawing}
            >
              {withdrawing ? "처리 중..." : "탈퇴하기"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-text-neutral-muted leading-relaxed">
            탈퇴 시 회원 정보, 업로드한 스타일, 피팅 히스토리, 남은 크레딧이
            <strong className="text-text-critical"> 모두 영구 삭제</strong>됩니다.
            이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-neutral">
              계속 진행하려면 <strong className="text-text-critical">탈퇴</strong>를 입력해 주세요.
            </label>
            <Input
              value={withdrawText}
              onChange={(e) => setWithdrawText(e.target.value)}
              placeholder="탈퇴"
              autoFocus
              disabled={withdrawing}
            />
          </div>
        </div>
      </ModalShell>
    </div>
  );
}
