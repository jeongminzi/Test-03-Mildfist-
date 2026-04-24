"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/atoms/Icon";

type Tone = "neutral" | "positive" | "critical" | "informative";

interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
  durationMs: number;
}

interface ToastApi {
  show: (message: string, opts?: { tone?: Tone; durationMs?: number }) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const toneClass: Record<Tone, string> = {
  neutral: "bg-bg-neutral-solid text-text-inverted",
  positive: "bg-bg-positive-weak text-text-positive border border-border-muted",
  critical: "bg-bg-brand-weak text-text-critical border border-border-muted",
  informative: "bg-bg-neutral-weak text-text-informative border border-border-muted",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastApi["show"]>((message, opts) => {
    const id = ++idRef.current;
    const tone = opts?.tone ?? "neutral";
    const durationMs = opts?.durationMs ?? 3000;
    setItems((prev) => [...prev, { id, message, tone, durationMs }]);
    setTimeout(() => remove(id), durationMs);
  }, [remove]);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[60] flex flex-col items-center gap-2 pointer-events-none"
        aria-live="polite"
        role="status"
      >
        {items.map((t) => (
          <ToastItemView key={t.id} item={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItemView({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  // Keep mount/unmount transitions implicit; CSS could be added later.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={cn(
        "pointer-events-auto inline-flex items-center gap-3 px-4 py-2.5 rounded-pill text-sm font-medium shadow-popover",
        toneClass[item.tone],
      )}
    >
      <span>{item.message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="bg-transparent border-none text-current opacity-60 hover:opacity-100 cursor-pointer inline-flex items-center"
      >
        <Icon name="close" size={16} aria-label="닫기" />
      </button>
    </div>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Soft fallback so a missing provider doesn't crash a screen.
    return { show: (msg) => console.warn("[toast] provider missing:", msg) };
  }
  return ctx;
}
