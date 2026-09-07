import { useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, Download } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  /** Value used for CSV export. Falls back to sortValue when omitted; columns
   * with neither (e.g. an action/icon column) are left out of the export. */
  exportValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  /** When set, shows an "Export CSV" button above the table that downloads
   * the currently displayed rows to this filename. */
  exportFilename?: string;
}

type SortState = { key: string; direction: "asc" | "desc" } | null;

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportRowsToCsv<T>(columns: DataTableColumn<T>[], rows: T[], filename: string) {
  const exportCols = columns.filter((c) => c.exportValue || c.sortValue);
  const header = exportCols.map((c) => csvCell(c.label)).join(",");
  const lines = rows.map((row) =>
    exportCols.map((c) => csvCell((c.exportValue ?? c.sortValue!)(row))).join(",")
  );
  const csv = [header, ...lines].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable<T>({ columns, data, keyField, onRowClick, emptyMessage = "Nothing here yet.", exportFilename }: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);

  const sorted = (() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.direction === "asc" ? cmp : -cmp;
    });
    return copy;
  })();

  const toggleSort = (col: DataTableColumn<T>) => {
    if (!col.sortValue) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, direction: "asc" };
      if (prev.direction === "asc") return { key: col.key, direction: "desc" };
      return null;
    });
  };

  if (data.length === 0) {
    return (
      <div className="rounded-[16px] border border-border bg-card px-[24px] py-[48px] text-center text-[13px] text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {exportFilename && (
        <div className="mb-[12px] flex justify-end">
          <button
            type="button"
            onClick={() => exportRowsToCsv(columns, sorted, exportFilename)}
            className="inline-flex items-center gap-[6px] rounded-[10px] border border-border bg-card px-[12px] py-[8px] text-[12px] font-medium text-foreground transition-colors hover:bg-white/[0.03]"
          >
            <Download className="h-[14px] w-[14px]" />
            Export CSV
          </button>
        </div>
      )}
      {/* Desktop / tablet table */}
      <div className="hidden min-[901px]:block overflow-x-auto rounded-[16px] border border-border bg-card">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col)}
                  className={`px-[16px] py-[12px] text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground ${
                    col.sortValue ? "cursor-pointer select-none hover:text-foreground" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-[4px]">
                    {col.label}
                    {sort?.key === col.key &&
                      (sort.direction === "asc" ? (
                        <ChevronUp className="h-[12px] w-[12px]" />
                      ) : (
                        <ChevronDown className="h-[12px] w-[12px]" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={keyField(row)}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border last:border-b-0 ${
                  onRowClick ? "cursor-pointer transition-colors hover:bg-white/[0.03]" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-[16px] py-[12px] align-middle text-foreground">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-[12px] min-[901px]:hidden">
        {sorted.map((row) => (
          <div
            key={keyField(row)}
            onClick={() => onRowClick?.(row)}
            className={`rounded-[14px] border border-border bg-card p-[16px] ${onRowClick ? "cursor-pointer" : ""}`}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between gap-[12px] py-[6px] first:pt-0 last:pb-0">
                <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  {col.label}
                </span>
                <span className="text-[13px] text-foreground">{col.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
