import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface KeyValueColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
}

export interface KeyValueTableProps<T> {
  columns: ReadonlyArray<KeyValueColumn<T>>;
  rows: ReadonlyArray<T>;
  rowKey: (row: T) => string;
  emptyMessage?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

/* Compact data table for tight reference lists — sales-stats by day/month
   (admin/payments), credit packages (admin/credits). DataTable is heavier
   (sortable headers, hover rows, action columns); use this when the data
   is read-only and the visual goal is "list of numbers". */
export function KeyValueTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage,
  footer,
  className,
}: KeyValueTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-card border border-border-muted", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-neutral-weak text-text-neutral-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 font-medium", alignClass[col.align ?? "left"])}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-neutral-muted">
                {emptyMessage ?? "데이터가 없습니다."}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-border-muted">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-text-neutral", alignClass[col.align ?? "left"])}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {footer && (
        <div className="px-4 py-2 bg-bg-neutral-weak border-t border-border-muted">
          {footer}
        </div>
      )}
    </div>
  );
}
