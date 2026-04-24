import { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, className, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-text-neutral", className)}
      {...rest}
    >
      {children}
      {required && <span className="ml-1 text-text-critical">*</span>}
    </label>
  );
}

export function HelpText({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-xs text-text-neutral-subtle", className)}>{children}</p>;
}

export function ErrorText({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-xs text-text-critical", className)}>{children}</p>;
}
