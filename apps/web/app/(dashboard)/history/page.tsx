"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  useTable,
  stockFeatures,
} from "@tanstack/react-table";
import type { ExecutionHistoryItem } from "@flowmind/shared";
import { History as HistoryIcon } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDuration } from "@/lib/format";
import { EmptyState } from "@/components/shared/empty-state";
import { TableRowSkeleton } from "@/components/shared/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useI18n } from "@/lib/i18n";

type Features = typeof stockFeatures;
const columnHelper = createColumnHelper<Features, ExecutionHistoryItem>();

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default function HistoryPage() {
  const { t } = useI18n();
  const { data: executions, isLoading, isError, error } = useQuery({
    queryKey: ["executions", "history"],
    queryFn: () => api.listAllExecutions(),
  });

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("workflow_name", {
          header: t("hist.workflow"),
          cell: (info) => (
            <Link
              href={`/workflows/${info.row.original.workflow_id}`}
              className="text-[13px] font-medium text-text-primary hover:underline"
            >
              {info.getValue()}
            </Link>
          ),
        }),
        columnHelper.accessor("status", {
          header: t("hist.status"),
          cell: (info) => <StatusBadge status={info.getValue()} />,
        }),
        columnHelper.accessor("created_at", {
          header: t("hist.date"),
          cell: (info) => (
            <span className="text-[12.5px] text-text-secondary">
              {dateFormatter.format(new Date(info.getValue()))}
            </span>
          ),
        }),
        columnHelper.accessor("duration_ms", {
          header: t("hist.duration"),
          cell: (info) => (
            <span className="font-mono text-[12px] text-text-secondary">
              {formatDuration(info.getValue())}
            </span>
          ),
        }),
      ]),
    [t]
  );

  const table = useTable({
    features: stockFeatures,
    columns,
    data: executions ?? [],
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <header className="mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          {t("hist.title")}
        </h1>
        <p className="text-[13px] text-text-secondary">
          {t("hist.subtitle")}
        </p>
      </header>

      {isError && (
        <p className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
          {error instanceof Error
            ? error.message
            : t("common.error")}
        </p>
      )}

      {isLoading ? (
        <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : (executions?.length ?? 0) === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={t("hist.empty")}
          description={t("hist.subtitle")}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface-raised">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border/70">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/40 transition-colors last:border-0 hover:bg-surface-overlay/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}