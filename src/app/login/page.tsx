"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Spinner } from "@/components/atoms/Spinner";
import { FormField } from "@/components/molecules/FormField";
import { Card } from "@/components/molecules/Card";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const result = await login(email, password);
        if (result.ok) {
          router.push(redirectTo);
        } else {
          setError(result.error || "로그인에 실패했습니다.");
        }
      } else {
        if (!name.trim()) {
          setError("이름을 입력해주세요.");
          setLoading(false);
          return;
        }
        const result = await signup(email, password, name);
        if (result.ok) {
          router.push(redirectTo);
        } else {
          setError(result.error || "회원가입에 실패했습니다.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: "demo@mildfist.com", password: "demo1234", label: "demo" },
    { email: "fashion@mildfist.com", password: "fashion1234", label: "fashion" },
    { email: "test@mildfist.com", password: "test1234", label: "test" },
  ];

  const fillDemo = (acc: { email: string; password: string }) => {
    setMode("login");
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-bg-default">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center mb-3 w-14 h-14 rounded-full bg-bg-brand-solid shadow-card">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3v12" />
              <path d="M18 9a3 3 0 0 1-3 3H6" />
              <path d="m10 8 -4 4 4 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-neutral">MildFist</h1>
          <p className="mt-1 text-sm text-text-neutral-muted">
            {mode === "login" ? "로그인하여 시작하세요" : "새 계정을 만드세요"}
          </p>
        </div>

        <Card padding="lg" bordered shadow>
          {/* Mode toggle */}
          <div className="flex mb-5 p-1 bg-bg-neutral-weak rounded-control">
            {(["login", "signup"] as const).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError("");
                  }}
                  className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors cursor-pointer border-none ${
                    active ? "bg-bg-floating text-text-neutral shadow-card" : "bg-transparent text-text-neutral-subtle"
                  }`}
                >
                  {m === "login" ? "로그인" : "회원가입"}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <FormField id="name" label="이름">
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                />
              </FormField>
            )}

            <FormField id="email" label="이메일">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </FormField>

            <FormField id="password" label="비밀번호">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "4자 이상" : "비밀번호 입력"}
                required
              />
            </FormField>

            {error && <p className="text-sm text-text-critical">{error}</p>}

            <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
              {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
            </Button>
          </form>
        </Card>

        {/* Demo accounts — clickable to auto-fill */}
        <div className="mt-4">
          <p className="text-xs font-medium mb-2 text-text-neutral-muted px-1">
            데모 계정 (탭하여 채우기)
          </p>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc)}
                className="px-3 py-1.5 text-xs font-medium rounded-pill bg-bg-neutral-weak text-text-neutral-muted hover:bg-bg-neutral-muted hover:text-text-neutral transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-brand"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-neutral-subtle">
          가입 시{" "}
          <Link href="/terms" className="text-text-neutral-muted underline">
            이용약관
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
