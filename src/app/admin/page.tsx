"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { StatCard } from "@/components/molecules/StatCard";

interface Stats {
  totalUsers: number;
  todayActive: number;
  chargeCount: number;
  chargeTotal: number;
  totalFittings: number;
}

interface Activity {
  event_type: string;
  user_name: string;
  detail: string;
  created_at: string;
}

const EVENT_TONE: Record<string, string> = {
  signup: "bg-bg-positive-weak text-text-positive",
  style: "bg-bg-neutral-weak text-text-magic",
  fitting: "bg-bg-neutral-weak text-text-informative",
  charge: "bg-bg-brand-weak text-text-brand",
};
const EVENT_LABELS: Record<string, string> = {
  signup: "가입",
  style: "스타일",
  fitting: "피팅",
  charge: "충전",
};

const BrandIcon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-brand">
    <path d={d} />
  </svg>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setActivity(data.recentActivity || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 max-w-5xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6 text-text-neutral">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="총 가입자 수"
          value={(stats?.totalUsers ?? 0).toLocaleString()}
          icon={<BrandIcon d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />}
        />
        <StatCard
          label="오늘 활성 사용자"
          value={(stats?.todayActive ?? 0).toLocaleString()}
          icon={<BrandIcon d="M22 12h-4l-3 9L9 3l-3 9H2" />}
        />
        <StatCard
          label="크레딧 충전"
          value={`${stats?.chargeCount ?? 0}건 / ${(stats?.chargeTotal ?? 0).toLocaleString()}C`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" className="text-text-brand">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <StatCard
          label="피팅 이용 건수"
          value={(stats?.totalFittings ?? 0).toLocaleString()}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-brand">
              <path d="M6 3v12" />
              <path d="M18 9a3 3 0 0 1-3 3H6" />
            </svg>
          }
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-4 text-text-neutral">최근 활동</h2>
        <div className="overflow-hidden rounded-card border border-border-muted">
          {activity.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-text-neutral-muted">활동 내역이 없습니다.</p>
            </div>
          ) : (
            activity.map((a, i) => {
              const tone = EVENT_TONE[a.event_type] ?? "bg-bg-neutral-weak text-text-neutral-muted";
              const label = EVENT_LABELS[a.event_type] ?? a.event_type;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3.5 border-t border-border-muted first:border-t-0"
                >
                  <span className={"text-xs font-medium px-2 py-0.5 shrink-0 rounded-tag " + tone}>
                    {label}
                  </span>
                  <span className="text-sm flex-1 min-w-0 truncate text-text-neutral">
                    <strong>{a.user_name}</strong>
                    <span className="text-text-neutral-muted"> &middot; {a.detail}</span>
                  </span>
                  <span className="text-xs shrink-0 text-text-neutral-subtle">
                    {new Date(a.created_at).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
