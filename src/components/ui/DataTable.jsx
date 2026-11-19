import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

export default function DataTable({
  columns, rows, pageSize = 8, searchable = true, searchKeys,
  toolbar, emptyIcon, emptyTitle = "No records found", emptyMessage, onRowClick, dense, loading,
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  // If no explicit loading prop is given, briefly self-simulate a load so the
  // skeleton animation shows (demo). Pass `loading` to control it for real.
  const [selfLoad, setSelfLoad] = useState(loading === undefined);
  useEffect(() => {
    if (loading !== undefined) return;
    const t = setTimeout(() => setSelfLoad(false), 650);
    return () => clearTimeout(t);
  }, [loading]);
  const isLoading = loading === undefined ? selfLoad : loading;

  const filtered = useMemo(() => {
    let r = rows;
    if (q && searchable) {
      const keys = searchKeys || columns.map((c) => c.key);
      const s = q.toLowerCase();
      r = r.filter((row) => keys.some((k) => String(row[k] ?? "").toLowerCase().includes(s)));
    }
    if (sort) {
      const { key, dir } = sort;
      r = [...r].sort((a, b) => {
        const av = a[key], bv = b[key];
        const n = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return dir === "asc" ? n : -n;
      });
    }
    return r;
  }, [rows, q, sort, columns, searchable, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * pageSize, cur * pageSize);

  return (
    <div className="nb-card overflow-hidden">
      {(searchable || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-[#f3ece3] p-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <div className="relative sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search table"
                placeholder="Search…" className="nb-input pl-9" />
            </div>
          ) : <span />}
          {toolbar}
        </div>
      )}
      <div className="nb-scroll overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#f3ece3] bg-surface-muted/60 text-xs uppercase tracking-wide text-navy-600">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-4 py-3 font-semibold", c.align === "right" && "text-right", c.className)}>
                  {c.sortable !== false && c.key ? (
                    <button className="inline-flex items-center gap-1 hover:text-navy-700"
                      onClick={() => setSort((s) => s?.key === c.key ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "asc" })}>
                      {c.header}<ChevronsUpDown size={12} className="opacity-50" />
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={`sk-${i}`} className="border-b border-[#f6f1ea] last:border-0">
                    {columns.map((c, ci) => (
                      <td key={c.key} className={cn(dense ? "px-4 py-2.5" : "px-4 py-[14px]", c.align === "right" && "text-right")}>
                        <Skeleton className={cn("h-3.5", ci === 0 ? "w-3/5" : c.align === "right" ? "ml-auto w-10" : "w-4/5")} />
                      </td>
                    ))}
                  </tr>
                ))
              : slice.map((row, i) => (
                  <tr key={row.id ?? i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn("border-b border-[#f6f1ea] last:border-0", onRowClick && "cursor-pointer hover:bg-surface-muted")}>
                    {columns.map((c) => (
                      <td key={c.key} className={cn(dense ? "px-4 py-2" : "px-4 py-3", "align-middle text-navy-800", c.align === "right" && "text-right", c.cellClass)}>
                        {c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!isLoading && slice.length === 0 && (
        <EmptyState className="m-3 border-0 bg-transparent py-10" icon={emptyIcon} title={emptyTitle} message={emptyMessage} />
      )}
      {!isLoading && filtered.length > pageSize && (
        <div className="flex items-center justify-between border-t border-[#f3ece3] px-4 py-3 text-sm text-navy-600">
          <span>Showing {(cur - 1) * pageSize + 1}–{Math.min(cur * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button aria-label="Previous page" disabled={cur <= 1} onClick={() => setPage(cur - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#efe7dd] disabled:opacity-40 hover:bg-surface-muted"><ChevronLeft size={15} /></button>
            <span className="px-2 font-medium text-navy-800">{cur} / {pages}</span>
            <button aria-label="Next page" disabled={cur >= pages} onClick={() => setPage(cur + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#efe7dd] disabled:opacity-40 hover:bg-surface-muted"><ChevronRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
