import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  width?: string;
}

export interface DataTableProps<T> {
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: ReadonlyArray<T>;
  rowKey: (row: T) => string;
  emptyMessage?: ReactNode;
  className?: string;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({ columns, rows, rowKey, emptyMessage, className }: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-card border border-border-muted", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-neutral-weak text-text-neutral-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 font-medium", alignClass[col.align ?? "left"])}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-text-neutral-muted">
                {emptyMessage ?? "데이터가 없습니다."}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-border-muted hover:bg-bg-neutral-weak">
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
    </div>
  );
}
