import { ReactNode } from "react";
import { Label, HelpText, ErrorText } from "../atoms/Label";
import { cn } from "@/lib/cn";

export interface FormFieldProps {
  id?: string;
  label: ReactNode;
  required?: boolean;
  helpText?: ReactNode;
  errorText?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required,
  helpText,
  errorText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} required={required}>{label}</Label>
      {children}
      {errorText ? (
        <ErrorText>{errorText}</ErrorText>
      ) : helpText ? (
        <HelpText>{helpText}</HelpText>
      ) : null}
    </div>
  );
}
