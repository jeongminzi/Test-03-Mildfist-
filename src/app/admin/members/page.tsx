"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { SearchBar } from "@/components/molecules/SearchBar";
import { LikeButton } from "@/components/molecules/LikeButton";
import { Pagination } from "@/components/organisms/Pagination";

interface Member {
  id: number;
  email: string;
  name: string;
  credits: number;
  is_active: number;
  is_admin: number;
  style_count: number;
  fitting_count: number;
  created_at: string;
}

interface MemberDetail {
  member: {
    id: number;
    email: string;
    name: string;
    profile_image: string | null;
    credits: number;
    is_active: number;
    is_admin: number;
    created_at: string;
  };
  styles: { id: number; image_url: string; likes_count: number; is_hidden: number; created_at: string }[];
  fittings: { id: number; result_image: string | null; selected_items: string; created_at: string }[];
  creditHistory: { id: number; amount: number; type: string; description: string; status: string; created_at: string }[];
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<MemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/members?search=${encodeURIComponent(search)}&page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const toggleActive = async (memberId: number, currentActive: number) => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: currentActive === 1 ? 0 : 1 }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === memberId ? { ...m, is_active: currentActive === 1 ? 0 : 1 } : m,
          ),
        );
      }
    } catch {
      // ignore
    }
  };

  const toggleExpand = async (memberId: number) => {
    if (expandedId === memberId) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setExpandedId(memberId);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${memberId}`);
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      }
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 max-w-5xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6 text-text-neutral">회원 관리</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <SearchBar
          containerClassName="flex-1"
          placeholder="이름 또는 이메일로 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit" variant="secondary" size="md">검색</Button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-border-muted">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-bg-neutral-weak text-text-neutral-muted">
                  <th className="w-8"></th>
                  <th className="text-left px-4 py-3 font-medium">이름</th>
                  <th className="text-left px-4 py-3 font-medium">이메일</th>
                  <th className="text-left px-4 py-3 font-medium">가입일</th>
                  <th className="text-right px-4 py-3 font-medium">크레딧</th>
                  <th className="text-right px-4 py-3 font-medium">스타일</th>
                  <th className="text-center px-4 py-3 font-medium">상태</th>
                  <th className="text-center px-4 py-3 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-text-neutral-muted">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => {
                    const expanded = expandedId === m.id;
                    return (
                    <Fragment key={m.id}>
                      <tr
                        className="cursor-pointer transition-colors border-t border-border-muted hover:bg-bg-neutral-weak"
                        onClick={() => toggleExpand(m.id)}
                        aria-expanded={expanded}
                      >
                        <td className="pl-4 py-3 w-8">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`text-text-neutral-subtle transition-transform ${expanded ? "rotate-90" : ""}`}
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={m.name} size="sm" />
                            <span className="text-text-neutral font-medium">{m.name}</span>
                            {m.is_admin === 1 && <Badge tone="brand" size="sm">관리자</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-neutral-muted">{m.email}</td>
                        <td className="px-4 py-3 text-text-neutral-muted">
                          {new Date(m.created_at).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="px-4 py-3 text-right text-text-neutral font-medium">
                          {m.credits}
                        </td>
                        <td className="px-4 py-3 text-right text-text-neutral">{m.style_count}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge tone={m.is_active ? "positive" : "critical"} size="sm">
                            {m.is_active ? "활성" : "비활성"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant={m.is_active ? "danger" : "ghost"}
                            onClick={() => toggleActive(m.id, m.is_active)}
                          >
                            {m.is_active ? "비활성화" : "활성화"}
                          </Button>
                        </td>
                      </tr>

                      {expanded && (
                        <tr>
                          <td colSpan={8} className="bg-bg-neutral-weak border-t border-border-muted">
                            {detailLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <Spinner size="sm" />
                              </div>
                            ) : detail ? (
                              <div className="p-4 flex flex-col gap-4">
                                <div>
                                  <h4 className="text-xs font-semibold mb-2 text-text-neutral-muted">
                                    스타일 ({detail.styles.length})
                                  </h4>
                                  {detail.styles.length === 0 ? (
                                    <p className="text-xs text-text-neutral-subtle">없음</p>
                                  ) : (
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                      {detail.styles.map((s) => (
                                        <div key={s.id} className="shrink-0 w-[60px]">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={s.image_url}
                                            alt="회원 스타일 미리보기"
                                            className={
                                              "w-full h-[60px] object-cover rounded-md " +
                                              (s.is_hidden ? "opacity-40" : "")
                                            }
                                          />
                                          <div className="mt-0.5">
                                            <LikeButton liked={s.likes_count > 0} count={s.likes_count} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <h4 className="text-xs font-semibold mb-2 text-text-neutral-muted">
                                    크레딧 내역
                                  </h4>
                                  {detail.creditHistory.length === 0 ? (
                                    <p className="text-xs text-text-neutral-subtle">없음</p>
                                  ) : (
                                    <div className="flex flex-col gap-1">
                                      {detail.creditHistory.slice(0, 5).map((tx) => (
                                        <div
                                          key={tx.id}
                                          className="flex items-center justify-between text-xs"
                                        >
                                          <span className="text-text-neutral">{tx.description}</span>
                                          <span
                                            className={
                                              "font-medium " +
                                              (tx.amount > 0 ? "text-text-positive" : "text-text-critical")
                                            }
                                          >
                                            {tx.amount > 0 ? "+" : ""}{tx.amount}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-border-muted">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
