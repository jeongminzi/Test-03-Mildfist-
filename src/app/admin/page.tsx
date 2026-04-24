"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { ActivityFeed, ActivityItem } from "@/components/molecules/ActivityFeed";
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

const EVENT_TONE: Record<string, ActivityItem["eventTone"]> = {
  signup: "positive",
  style: "magic",
  fitting: "informative",
  charge: "brand",
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

  const feedItems: ActivityItem[] = activity.map((a, i) => ({
    key: String(i),
    eventLabel: EVENT_LABELS[a.event_type] ?? a.event_type,
    eventTone: EVENT_TONE[a.event_type] ?? "neutral",
    actor: a.user_name,
    detail: a.detail,
    timestamp: new Date(a.created_at).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

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
        <ActivityFeed items={feedItems} />
      </div>
    </div>
  );
}
