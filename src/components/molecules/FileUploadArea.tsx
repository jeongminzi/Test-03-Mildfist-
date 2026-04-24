"use client";

import { ReactNode, useRef, useState, DragEvent } from "react";
import { cn } from "@/lib/cn";

export interface FileUploadAreaProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onSelect: (files: File[]) => void;
  hint?: ReactNode;
  className?: string;
}

export function FileUploadArea({
  accept = "image/*",
  multiple = false,
  disabled,
  onSelect,
  hint,
  className,
}: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onSelect(Array.from(files));
  };

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "w-full flex flex-col items-center justify-center gap-2 py-12 px-6 rounded-card border-2 border-dashed cursor-pointer transition-colors",
        dragOver
          ? "border-border-brand bg-bg-brand-weak"
          : "border-border-muted bg-bg-neutral-weak hover:border-border-solid",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        className="text-text-neutral-subtle">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p className="text-sm font-medium text-text-neutral">이미지를 드래그하거나 클릭해서 업로드</p>
      {hint && <p className="text-xs text-text-neutral-muted">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  );
}
