"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";

export default function WorkflowsPage() {
  const queryClient = useQueryClient();

  const { data: workflows, isLoading, isError, error } = useQuery({
    queryKey: ["workflows"],
    queryFn: () => api.listWorkflows(),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => api.deleteWorkflow(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workflows"] }),
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Workflows</h1>
          <p className="text-[13px] text-text-secondary">
            Vos automatisations IA, prêtes à être lancées.
          </p>
        </div>
        <Link
          href="/workflows/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Plus size={15} />
          Nouveau
        </Link>
      </div>

      {isError && (
        <p className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
          {error instanceof Error ? error.message : "Impossible de charger les workflows"}
        </p>
      )}

      {isLoading ? (
        <p className="text-[13px] text-text-secondary">Chargement…</p>
      ) : (workflows?.length ?? 0) === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-raised text-text-secondary">
            <Plus size={22} />
          </div>
          <p className="text-sm font-medium text-text-primary">Aucun workflow</p>
          <p className="max-w-xs text-[13px] text-text-secondary">
            Créez votre premier workflow pour commencer à automatiser.
          </p>
          <Link
            href="/workflows/new"
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Plus size={15} />
            Créer un workflow
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(workflows ?? []).map((wf) => (
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
                      {wf.definition.nodes.length} nœuds ·{" "}
                      {new Date(wf.updated_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => void removeMutation.mutate(wf.id)}
                  title="Supprimer"
                  disabled={removeMutation.isPending}
                  className="rounded-md p-1.5 text-text-secondary opacity-0 transition-all hover:bg-error/15 hover:text-error group-hover:opacity-100 disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}