"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Spinner } from "@/components/atoms/Spinner";
import { Card } from "@/components/molecules/Card";
import { FormField } from "@/components/molecules/FormField";
import { DataTable, DataTableColumn } from "@/components/organisms/DataTable";
import { Pagination } from "@/components/organisms/Pagination";

interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string;
  status: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

interface SearchedUser {
  id: number;
  name: string;
  email: string;
  credits: number;
}

const PACKAGES = [
  { credits: 10, price: "1,000" },
  { credits: 30, price: "3,000" },
  { credits: 50, price: "5,000" },
];

export default function AdminCredits() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchedUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/credits?section=transactions&page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const searchUsers = async () => {
    if (!userSearch.trim()) return;
    try {
      const res = await fetch(`/api/admin/members?search=${encodeURIComponent(userSearch)}&page=1`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(
          (data.members || []).map((m: { id: number; name: string; email: string; credits: number }) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            credits: m.credits,
          })),
        );
      }
    } catch {
      // ignore
    }
  };

  const handleManualAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adjustAmount || !adjustReason) return;

    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/credits/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseInt(adjustAmount, 10),
          reason: adjustReason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `${data.userName}님에게 ${data.adjustment > 0 ? "+" : ""}${data.adjustment} 크레딧 처리 완료 (잔액: ${data.newBalance})`,
        });
        setAdjustAmount("");
        setAdjustReason("");
        setSelectedUser(null);
        setSearchResults([]);
        setUserSearch("");
        fetchTransactions();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "처리 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  const txColumns: DataTableColumn<Transaction>[] = [
    { key: "user", header: "회원", render: (r) => <span className="font-medium">{r.user_name}</span> },
    {
      key: "amount",
      header: "수량",
      align: "right",
      render: (r) => <span className="text-text-positive font-medium">+{r.amount}</span>,
    },
    { key: "desc", header: "내용", render: (r) => <span className="text-text-neutral-muted">{r.description}</span> },
    {
      key: "date",
      header: "일시",
      render: (r) => (
        <span className="text-text-neutral-subtle">
          {new Date(r.created_at).toLocaleDateString("ko-KR")}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-6 text-text-neutral">크레딧 관리</h1>

      {/* Package Settings */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-text-neutral">크레딧 패키지 설정</h2>
        <div className="overflow-hidden rounded-card border border-border-muted">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-neutral-weak text-text-neutral-muted">
                <th className="text-left px-4 py-3 font-medium">패키지</th>
                <th className="text-right px-4 py-3 font-medium">크레딧</th>
                <th className="text-right px-4 py-3 font-medium">가격</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGES.map((pkg, i) => (
                <tr key={i} className="border-t border-border-muted">
                  <td className="px-4 py-3 text-text-neutral">{pkg.credits}크레딧 패키지</td>
                  <td className="px-4 py-3 text-right text-text-neutral font-medium">{pkg.credits}</td>
                  <td className="px-4 py-3 text-right text-text-brand">{pkg.price}원</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-bg-neutral-weak border-t border-border-muted">
            <p className="text-xs text-text-neutral-subtle">
              프로토타입 — 패키지 수정 기능은 추후 추가됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Credit Adjustment */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-text-neutral">수동 크레딧 지급/회수</h2>
        <Card padding="lg" bordered>
          <form onSubmit={handleManualAdjust} className="flex flex-col gap-4">
            {/* User search / selection */}
            <div>
              <label className="text-xs font-medium mb-1.5 block text-text-neutral-muted">대상 회원</label>
              {selectedUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-bg-neutral-weak">
                    <span className="text-sm font-medium text-text-neutral">{selectedUser.name}</span>
                    <span className="text-xs text-text-neutral-muted">{selectedUser.email}</span>
                    <span className="text-xs text-text-neutral-subtle">잔액: {selectedUser.credits}</span>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchResults([]);
                      setUserSearch("");
                    }}
                  >
                    변경
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <Input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchUsers();
                        }
                      }}
                      placeholder="이름 또는 이메일 검색..."
                    />
                    <Button type="button" variant="secondary" onClick={searchUsers}>
                      검색
                    </Button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-2 overflow-hidden rounded-lg border border-border-muted">
                      {searchResults.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setSearchResults([]);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm bg-transparent border-none cursor-pointer transition-colors hover:bg-bg-neutral-weak border-b border-border-muted last:border-b-0"
                        >
                          <span className="text-text-neutral font-medium">{u.name}</span>
                          <span className="text-xs text-text-neutral-muted">{u.email}</span>
                          <span className="text-xs ml-auto text-text-neutral-subtle">잔액: {u.credits}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <FormField id="amount" label="수량 (양수: 지급, 음수: 회수)">
              <Input
                id="amount"
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="예: 50 또는 -20"
              />
            </FormField>

            <FormField id="reason" label="사유">
              <Input
                id="reason"
                type="text"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="예: 이벤트 보상, 오류 보정 등"
              />
            </FormField>

            {message && (
              <div
                className={
                  "px-3 py-2 text-xs rounded-lg " +
                  (message.type === "success"
                    ? "bg-bg-positive-weak text-text-positive"
                    : "bg-bg-brand-weak text-text-critical")
                }
              >
                {message.text}
              </div>
            )}

            <Button
              type="submit"
              disabled={!selectedUser || !adjustAmount || !adjustReason}
              loading={submitting}
              className="self-start"
            >
              {submitting ? "처리 중..." : "크레딧 처리"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Charge History */}
      <div>
        <h2 className="text-sm font-semibold mb-3 text-text-neutral">충전 내역</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            <DataTable
              rows={transactions}
              rowKey={(r) => String(r.id)}
              columns={txColumns}
              emptyMessage="충전 내역이 없습니다."
            />
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
