"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { Card } from "@/components/molecules/Card";
import { EmptyState } from "@/components/molecules/EmptyState";
import { LikeButton } from "@/components/molecules/LikeButton";
import { TabBar } from "@/components/molecules/TabBar";
import { Pagination } from "@/components/organisms/Pagination";

type Tab = "all" | "reports";

interface ContentItem {
  id: number;
  image_url: string;
  likes_count: number;
  is_hidden: number;
  created_at: string;
  user_name: string;
  user_email: string;
}

interface ReportItem {
  id: number;
  reason: string;
  status: string;
  created_at: string;
  style_id: number;
  reporter_name: string;
  reporter_email: string;
  style_image: string;
  style_hidden: number;
  style_owner_name: string;
}

export default function AdminContents() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contents?tab=${activeTab}&page=${page}`);
      if (res.ok) {
        const data = await res.json();
        if (activeTab === "all") setContents(data.contents || []);
        else setReports(data.reports || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleContentAction = async (styleId: number, action: "hide" | "unhide" | "delete") => {
    try {
      const res = await fetch(`/api/admin/contents/${styleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        if (action === "delete") {
          setContents((prev) => prev.filter((c) => c.id !== styleId));
        } else if (action === "hide") {
          setContents((prev) => prev.map((c) => (c.id === styleId ? { ...c, is_hidden: 1 } : c)));
        } else {
          setContents((prev) => prev.map((c) => (c.id === styleId ? { ...c, is_hidden: 0 } : c)));
        }
      }
    } catch {
      // ignore
    }
  };

  const handleReportAction = async (reportId: number, action: "hide_content" | "dismiss") => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-xl font-semibold mb-6 text-text-neutral">콘텐츠 관리</h1>

      <div className="mb-6">
        <TabBar
          items={[
            { key: "all", label: "전체 콘텐츠" },
            { key: "reports", label: "신고 접수" },
          ]}
          value={activeTab}
          onChange={(k) => {
            setActiveTab(k);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <>
          {activeTab === "all" && (
            <>
              {contents.length === 0 ? (
                <EmptyState title="콘텐츠가 없습니다" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {contents.map((c) => (
                    <div
                      key={c.id}
                      className={
                        "flex flex-col rounded-card border border-border-muted overflow-hidden " +
                        (c.is_hidden ? "opacity-50" : "")
                      }
                    >
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.image_url}
                          alt="Style"
                          className="w-full h-[140px] object-cover bg-bg-neutral-weak"
                        />
                        {c.is_hidden === 1 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-bg-overlay">
                            <span className="text-xs font-medium text-text-inverted">숨김 처리됨</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-text-neutral">{c.user_name}</span>
                          <LikeButton liked={c.likes_count > 0} count={c.likes_count} />
                        </div>
                        <p className="text-xs mb-3 text-text-neutral-subtle">
                          {new Date(c.created_at).toLocaleDateString("ko-KR")}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={c.is_hidden ? "ghost" : "danger"}
                            className="flex-1"
                            onClick={() => handleContentAction(c.id, c.is_hidden ? "unhide" : "hide")}
                          >
                            {c.is_hidden ? "숨김 해제" : "숨김"}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              if (confirm("정말 삭제하시겠습니까?")) {
                                handleContentAction(c.id, "delete");
                              }
                            }}
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "reports" && (
            <>
              {reports.length === 0 ? (
                <EmptyState title="접수된 신고가 없습니다" />
              ) : (
                <Card padding="none" bordered>
                  {reports.map((r, i) => (
                    <div
                      key={r.id}
                      className={
                        "flex items-center gap-4 p-4 " +
                        (i > 0 ? "border-t border-border-muted" : "")
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.style_image}
                        alt="Reported style"
                        className="shrink-0 w-14 h-14 rounded-md object-cover bg-bg-neutral-weak"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-neutral">
                          <strong>{r.reporter_name}</strong>
                          <span className="text-text-neutral-muted"> 님이 </span>
                          <strong>{r.style_owner_name}</strong>
                          <span className="text-text-neutral-muted"> 님의 스타일을 신고</span>
                        </p>
                        <p className="text-xs mt-0.5 text-text-neutral-muted">사유: {r.reason}</p>
                        <p className="text-xs mt-0.5 text-text-neutral-subtle">
                          {new Date(r.created_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="danger" onClick={() => handleReportAction(r.id, "hide_content")}>
                          콘텐츠 숨김
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleReportAction(r.id, "dismiss")}>
                          무시
                        </Button>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
}
