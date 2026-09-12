"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Timer,
  Workflow,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { EmptyState } from "@/components/shared/empty-state";
import { KpiCardSkeleton } from "@/components/shared/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useI18n } from "@/lib/i18n";

export default function DashboardPage() {
  const { t } = useI18n();
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.getStats(),
    // Feed "temps réel" : rafraîchissement léger des dernières exécutions.
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });

  const total = stats?.workflows_total ?? 0;
  const kpis = [
    {
      labelKey: "dash.kpi.active",
      value: stats?.workflows_active ?? "–",
      detail: `${total} ${t("wf.title").toLowerCase()}`,
      icon: Workflow,
      tone: "bg-accent/12 text-accent-hover",
    },
    {
      labelKey: "dash.kpi.executions",
      value: stats?.executions_total ?? "–",
      detail: `${stats?.executions_success ?? 0} ${t("status.success").toLowerCase()}`,
      icon: Play,
      tone: "bg-info/12 text-info",
    },
    {
      labelKey: "dash.kpi.success",
      value:
        stats ? `${Math.round(stats.execution_success_rate * 100)} %` : "–",
      detail: t("wf.runs"),
      icon: CheckCircle2,
      tone: "bg-success/15 text-success",
    },
    {
      labelKey: "hist.duration",
      value: stats?.avg_duration_ms != null ? `${Math.round(stats.avg_duration_ms / 1000 / 60 * 10) / 10} s` : "–",
      detail: t("wf.runs"),
      icon: Timer,
      tone: "bg-warning/15 text-warning",
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <header className="mb-6 animate-appear">
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          {t("dash.title")}
        </h1>
        <p className="text-[13px] text-text-secondary">
          {t("dash.subtitle")}
        </p>
      </header>

      {isError && (
        <p className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
          {error instanceof Error
            ? error.message
            : t("common.error")}
        </p>
      )}

      {/* KPI */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.labelKey}
                  className="rounded-xl border border-border bg-surface-raised p-4"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${kpi.tone}`}
                    >
                      <Icon size={15} strokeWidth={2} />
                    </div>
                    <p className="text-[12.5px] font-medium text-text-secondary">
                      {t(kpi.labelKey)}
                    </p>
                  </div>
                  <p className="mt-3 font-mono text-2xl font-medium tracking-tight text-text-primary">
                    {kpi.value}
                  </p>
                  <p className="mt-1 text-[11.5px] text-text-muted">
                    {kpi.detail}
                  </p>
                </div>
              );
            })}
      </div>

      {/* Activity feed */}
      <section className="mt-8 flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-2">
          <Activity size={15} className="text-text-secondary" />
          <h2 className="text-[13.5px] font-semibold text-text-primary">
            {t("dash.recent")}
          </h2>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            en direct
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-menu/70" />
            ))}
          </div>
        ) : (stats?.recent_executions.length ?? 0) === 0 ? (
          <EmptyState
            icon={Activity}
            title={t("dash.recent.empty")}
            description={t("wf.empty.desc")}
          >
            <Link
              href="/workflows/new"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <Plus size={15} />
              {t("dash.create")}
            </Link>
          </EmptyState>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
            {(stats?.recent_executions ?? []).map((exec, i) => (
              <div
                key={exec.id}
                className={
                  "flex items-center gap-3 px-4 py-3" +
                  (i > 0 ? " border-t border-border/70" : "")
                }
              >
                <Link
                  href={`/workflows/${exec.workflow_id}`}
                  className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-text-primary hover:underline"
                >
                  <Clock size={13} className="shrink-0 text-text-muted" />
                  <span className="truncate">{exec.workflow_name}</span>
                </Link>
                <StatusBadge status={exec.status} />
                <span className="ml-auto shrink-0 text-[11.5px] text-text-muted">
                  {new Date(exec.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}