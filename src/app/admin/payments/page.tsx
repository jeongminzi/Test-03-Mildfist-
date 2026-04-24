"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { KeyValueTable, KeyValueColumn } from "@/components/molecules/KeyValueTable";
import { TabBar } from "@/components/molecules/TabBar";
import { useToast } from "@/components/molecules/Toast";
import { DataTable, DataTableColumn } from "@/components/organisms/DataTable";
import { ModalShell } from "@/components/organisms/ModalShell";
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
  const [refundTarget, setRefundTarget] = useState<Transaction | null>(null);
  const toast = useToast();

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

  const handleRefundConfirm = async () => {
    if (!refundTarget) return;
    const id = refundTarget.id;
    setRefunding(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/refund`, { method: "POST" });
      if (res.ok) {
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === id ? { ...tx, status: "refunded" } : tx)),
        );
        toast.show("환불 처리 완료", { tone: "positive" });
        setRefundTarget(null);
      } else {
        const data = await res.json();
        toast.show(data.error || "환불 처리에 실패했습니다.", { tone: "critical" });
      }
    } catch {
      toast.show("환불 처리 중 오류가 발생했습니다.", { tone: "critical" });
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
            onClick={() => setRefundTarget(r)}
            disabled={refunding === r.id}
          >
            {refunding === r.id ? "처리중..." : "환불"}
          </Button>
        ) : null,
    },
  ];

  const statColumns = <T extends { count: number; total: number }>(
    headerLabel: string,
    labelCol: (r: T) => string,
  ): KeyValueColumn<T>[] => [
    { key: "label", header: headerLabel, render: (r) => labelCol(r) },
    { key: "count", header: "건수", align: "right", render: (r) => `${r.count}건` },
    {
      key: "total",
      header: "크레딧 합계",
      align: "right",
      render: (r) => (
        <span className="text-text-positive font-medium">{r.total.toLocaleString()}C</span>
      ),
    },
  ];

  return (
    <div className="p-8 sm:p-10 max-w-5xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6 text-text-neutral">결제 관리</h1>

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
              <KeyValueTable<DailyStat>
                rows={dailyStats}
                rowKey={(s) => s.day}
                columns={statColumns<DailyStat>("날짜", (s) => s.day)}
                emptyMessage="최근 7일간 매출이 없습니다."
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-text-neutral">월별 매출 (최근 3개월)</h3>
              <KeyValueTable<MonthlyStat>
                rows={monthlyStats}
                rowKey={(s) => s.month}
                columns={statColumns<MonthlyStat>("월", (s) => s.month)}
                emptyMessage="최근 3개월간 매출이 없습니다."
              />
            </div>
          </div>
        ))}

      <ModalShell
        open={!!refundTarget}
        onClose={() => {
          if (refunding === null) setRefundTarget(null);
        }}
        title="환불 처리"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRefundTarget(null)}
              disabled={refunding !== null}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleRefundConfirm}
              loading={refunding !== null}
            >
              환불하기
            </Button>
          </>
        }
      >
        {refundTarget && (
          <p className="text-sm text-text-neutral-muted">
            <strong className="text-text-neutral">{refundTarget.user_name}</strong>님의
            결제 #{refundTarget.id} ({refundTarget.amount} 크레딧)을 환불 처리합니다.
            환불 시 사용자의 크레딧이 차감되며, 작업은 되돌릴 수 없습니다.
          </p>
        )}
      </ModalShell>
    </div>
  );
}
