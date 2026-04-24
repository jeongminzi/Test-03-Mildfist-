"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { TabBar } from "@/components/molecules/TabBar";
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

interface DailyStat {
  day: string;
  count: number;
  total: number;
}

interface MonthlyStat {
  month: string;
  count: number;
  total: number;
}

type Tab = "transactions" | "stats";

const priceMap: Record<number, string> = { 10: "1,000", 30: "3,000", 50: "5,000" };

const statusTone = (status: string): "positive" | "critical" | "neutral" =>
  status === "completed" ? "positive" : status === "refunded" ? "critical" : "neutral";

const statusLabel = (status: string) =>
  status === "completed" ? "완료" : status === "refunded" ? "환불됨" : status;

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState<Tab>("transactions");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState<number | null>(null);

  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?tab=transactions&page=${page}`);
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

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/payments?tab=stats");
      if (res.ok) {
        const data = await res.json();
        setDailyStats(data.dailyStats || []);
        setMonthlyStats(data.monthlyStats || []);
      }
    } catch {
      // ignore
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "transactions") fetchTransactions();
    else fetchStats();
  }, [activeTab, fetchTransactions, fetchStats]);

  const handleRefund = async (transactionId: number) => {
    if (!confirm("정말 환불 처리하시겠습니까?")) return;
    setRefunding(transactionId);
    try {
      const res = await fetch(`/api/admin/payments/${transactionId}/refund`, { method: "POST" });
      if (res.ok) {
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === transactionId ? { ...tx, status: "refunded" } : tx)),
        );
      } else {
        const data = await res.json();
        alert(data.error || "환불 처리에 실패했습니다.");
      }
    } catch {
      alert("환불 처리 중 오류가 발생했습니다.");
    } finally {
      setRefunding(null);
    }
  };

  const txColumns: DataTableColumn<Transaction>[] = [
    { key: "id", header: "ID", render: (r) => <span className="text-text-neutral-subtle">#{r.id}</span> },
    { key: "user", header: "회원", render: (r) => <span className="font-medium">{r.user_name}</span> },
    {
      key: "credits",
      header: "크레딧",
      align: "right",
      render: (r) => (
        <span
          className={
            "font-medium " + (r.type === "refund" ? "text-text-critical" : "text-text-positive")
          }
        >
          {r.amount > 0 ? "+" : ""}{r.amount}
        </span>
      ),
    },
    {
      key: "price",
      header: "금액",
      align: "right",
      render: (r) => (
        <span>{r.type === "charge" ? `${priceMap[r.amount] || "-"}원` : "-"}</span>
      ),
    },
    {
      key: "status",
      header: "상태",
      align: "center",
      render: (r) => <Badge tone={statusTone(r.status)} size="sm">{statusLabel(r.status)}</Badge>,
    },
    {
      key: "date",
      header: "일시",
      render: (r) => (
        <span className="text-text-neutral-subtle">
          {new Date(r.created_at).toLocaleDateString("ko-KR")}
        </span>
      ),
    },
    {
      key: "action",
      header: "액션",
      align: "center",
      render: (r) =>
        r.type === "charge" && r.status === "completed" ? (
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleRefund(r.id)}
            disabled={refunding === r.id}
          >
            {refunding === r.id ? "처리중..." : "환불"}
          </Button>
        ) : null,
    },
  ];

  const StatTable = <T extends { count: number; total: number }>({
    headerLabel,
    rows,
    rowKey,
    labelCol,
    emptyMessage,
  }: {
    headerLabel: string;
    rows: T[];
    rowKey: (r: T) => string;
    labelCol: (r: T) => string;
    emptyMessage: string;
  }) => (
    <div className="overflow-hidden rounded-card border border-border-muted">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-neutral-weak text-text-neutral-muted">
            <th className="text-left px-4 py-3 font-medium">{headerLabel}</th>
            <th className="text-right px-4 py-3 font-medium">건수</th>
            <th className="text-right px-4 py-3 font-medium">크레딧 합계</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-8 text-text-neutral-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((s) => (
              <tr key={rowKey(s)} className="border-t border-border-muted">
                <td className="px-4 py-3 text-text-neutral">{labelCol(s)}</td>
                <td className="px-4 py-3 text-right text-text-neutral-muted">{s.count}건</td>
                <td className="px-4 py-3 text-right text-text-positive font-medium">
                  {s.total.toLocaleString()}C
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-xl font-semibold mb-6 text-text-neutral">결제 관리</h1>

      <div className="mb-6">
        <TabBar
          items={[
            { key: "transactions", label: "결제 내역" },
            { key: "stats", label: "매출 통계" },
          ]}
          value={activeTab}
          onChange={(k) => {
            setActiveTab(k);
            setPage(1);
          }}
        />
      </div>

      {activeTab === "transactions" &&
        (loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <>
            <DataTable
              rows={transactions}
              rowKey={(r) => String(r.id)}
              columns={txColumns}
              emptyMessage="결제 내역이 없습니다."
            />
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
          </>
        ))}

      {activeTab === "stats" &&
        (statsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-text-neutral">일별 매출 (최근 7일)</h3>
              <StatTable
                headerLabel="날짜"
                rows={dailyStats}
                rowKey={(s) => s.day}
                labelCol={(s) => s.day}
                emptyMessage="최근 7일간 매출이 없습니다."
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-text-neutral">월별 매출 (최근 3개월)</h3>
              <StatTable
                headerLabel="월"
                rows={monthlyStats}
                rowKey={(s) => s.month}
                labelCol={(s) => s.month}
                emptyMessage="최근 3개월간 매출이 없습니다."
              />
            </div>
          </div>
        ))}
    </div>
  );
}
