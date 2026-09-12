"use client";

import { Suspense, useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Folder, Plus, Search, SearchX, Settings2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";
import { WorkflowPropertiesDialog } from "@/components/workflow/workflow-properties-dialog";

function WorkflowsInner({ initialFolder }: { initialFolder: string | null }) {
  const { t } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [folder, setFolder] = useState<string | null>(initialFolder);
  const [tag, setTag] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(searchInput.trim());

  const { data: workflows, isLoading, isError } = useQuery({
    queryKey: ["workflows", deferredSearch, folder, tag],
    queryFn: () =>
      api.listWorkflows({
        search: deferredSearch || undefined,
        folder: folder ?? undefined,
        tag: tag ? [tag] : undefined,
      }),
  });

  const folders = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const wf of workflows ?? []) {
      if (wf.folder && !seen.has(wf.folder)) {
        seen.add(wf.folder);
        list.push(wf.folder);
      }
    }
    return list;
  }, [workflows]);

  const tags = useMemo(() => {
    const seen = new Set<string>();
    for (const wf of workflows ?? []) {
      for (const tg of wf.tags ?? []) {
        if (!seen.has(tg)) seen.add(tg);
      }
    }
    return [...seen].slice(0, 12);
  }, [workflows]);

  const removeMutation = useMutation({
    mutationFn: (id: number) => api.deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success(t("wf.delete.action"));
    },
    onError: () => toast.error(t("common.error")),
  });

  const hasFilters = Boolean(deferredSearch || folder || tag);
  const filteredEmpty = hasFilters && (workflows?.length ?? 0) === 0;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">{t("wf.title")}</h1>
          <p className="text-[13px] text-text-secondary">{t("wf.subtitle")}</p>
        </div>
        <Link
          href="/workflows/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Plus size={15} />
          {t("wf.new")}
        </Link>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="mb-4 flex flex-col gap-2.5">
        <div className="relative max-w-sm">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("wf.search")}
            className="w-full rounded-lg border border-border bg-surface-base py-2 pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent/50 focus:outline-none"
          />
        </div>
        {(folders.length > 0 || tag || folder) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setFolder(folder === f ? null : f)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                  folder === f
                    ? "border-accent/50 bg-accent/12 text-accent-hover"
                    : "border-border bg-surface-raised text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                <Folder size={11} />
                {f}
              </button>
            ))}
            {tags.map((tg) => (
              <button
                key={tg}
                onClick={() => setTag(tag === tg ? null : tg)}
                className={[
                  "rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                  tag === tg
                    ? "border-accent/50 bg-accent/12 text-accent-hover"
                    : "border-border bg-surface-raised text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                #{tg}
              </button>
            ))}
          </div>
        )}
      </div>

      {isError && (
        <p className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
          {t("common.error")}
        </p>
      )}

      {isLoading ? (
        <p className="text-[13px] text-text-secondary">{t("common.loading")}</p>
      ) : filteredEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-raised text-text-secondary">
            <SearchX size={22} />
          </div>
          <p className="text-sm font-medium text-text-primary">{t("wf.filters.empty")}</p>
          <button
            onClick={() => {
              setSearchInput("");
              setFolder(null);
              setTag(null);
            }}
            className="text-[13px] text-accent-hover hover:underline"
          >
            {t("wf.filters.reset")}
          </button>
        </div>
      ) : (workflows?.length ?? 0) === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-raised text-text-secondary">
            <Plus size={22} />
          </div>
          <p className="text-sm font-medium text-text-primary">{t("wf.empty.title")}</p>
          <p className="max-w-xs text-[13px] text-text-secondary">{t("wf.empty.desc")}</p>
          <button
            onClick={() => router.push("/workflows/new")}
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Plus size={15} />
            {t("wf.empty.create")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(workflows ?? []).map((wf) => {
            const nodesCount = wf.definition?.nodes?.length ?? 0;
            return (
              <div
                key={wf.id}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 transition-all duration-150 hover:border-accent/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent-hover">
                      <Plus size={15} />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/workflows/${wf.id}`}
                        className="block truncate text-[14px] font-medium text-text-primary hover:underline"
                      >
                        {wf.name}
                      </Link>
                      <p className="text-[11px] text-text-secondary">
                        {nodesCount} nœuds · {new Date(wf.updated_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <button
                      onClick={() => setEditingId(wf.id)}
                      title={t("wf.properties")}
                      className="rounded-md p-1.5 text-text-secondary opacity-0 transition-all hover:bg-accent/15 hover:text-accent-hover group-hover:opacity-100"
                    >
                      <Settings2 size={14} />
                    </button>
                    <button
                      onClick={() => void removeMutation.mutate(wf.id)}
                      title={t("wf.delete")}
                      disabled={removeMutation.isPending}
                      className="rounded-md p-1.5 text-text-secondary opacity-0 transition-all hover:bg-error/15 hover:text-error group-hover:opacity-100 disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {(wf.folder || (wf.tags?.length ?? 0) > 0) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {wf.folder && (
                      <button
                        onClick={() => setFolder(folder === wf.folder ? null : wf.folder!)}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-base px-2 py-0.5 text-[11px] text-text-secondary hover:text-text-primary"
                      >
                        <Folder size={10} />
                        {wf.folder}
                      </button>
                    )}
                    {(wf.tags ?? []).slice(0, 3).map((tg) => (
                      <button
                        key={tg}
                        onClick={() => setTag(tag === tg ? null : tg)}
                        className="rounded-full border border-border bg-surface-base px-2 py-0.5 text-[11px] text-text-secondary hover:text-text-primary"
                      >
                        #{tg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editingId !== null && (
        <WorkflowPropertiesDialog
          workflowId={editingId}
          onClose={() => setEditingId(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ["workflows"] });
            queryClient.invalidateQueries({ queryKey: ["folders"] });
          }}
        />
      )}
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense fallback={null}>
      <WorkflowsInnerRoute />
    </Suspense>
  );
}

function WorkflowsInnerRoute() {
  const searchParams = useSearchParams();
  const initialFolder = searchParams.get("folder");
  return <WorkflowsInner key={initialFolder ?? "root"} initialFolder={initialFolder} />;
}