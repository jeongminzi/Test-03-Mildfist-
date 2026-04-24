"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/cn";

export interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function ModalShell({ open, onClose, title, footer, children, size = "md", className }: ModalShellProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn("w-full bg-bg-floating rounded-modal shadow-modal overflow-hidden", sizeClass[size], className)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-border-muted">
            <h3 className="text-base font-semibold text-text-neutral">{title}</h3>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-border-muted flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}
