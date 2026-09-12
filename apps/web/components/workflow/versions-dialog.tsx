"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, History, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";
import { useWorkflowStore } from "@/stores/workflow-store";

export function VersionsDialog({
  workflowId,
  onClose,
}: {
  workflowId: number;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("");

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["versions", workflowId],
    queryFn: () => api.listVersions(workflowId),
  });

  const saveVersion = useMutation({
    mutationFn: () => api.saveVersion(workflowId, label.trim() || undefined),
    onSuccess: () => {
      setLabel("");
      queryClient.invalidateQueries({ queryKey: ["versions", workflowId] });
      toast.success(t("ver.saved"));
    },
    onError: () => toast.error(t("common.error")),
  });

  const restoreVersion = useMutation({
    mutationFn: (versionId: number) => api.restoreVersion(workflowId, versionId),
    onSuccess: (wf) => {
      useWorkflowStore
        .getState()
        .setGraph(wf.definition.nodes ?? [], wf.definition.edges ?? [], { dirty: true });
      queryClient.invalidateQueries({ queryKey: ["workflow", workflowId] });
      onClose();
      toast.success(t("ver.restored"));
    },
    onError: () => toast.error(t("common.error")),
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-label={t("ver.title")}
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl border border-border bg-surface-raised p-5 shadow-xl shadow-black/20"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-text-primary">
            <History size={16} className="text-text-secondary" />
            {t("ver.title")}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary"
          >
            <X size={15} />
          </button>
        </div>

        {/* Prendre un instantané */}
        <div className="mb-4 flex gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void saveVersion.mutate();
            }}
            placeholder={t("ver.placeholder")}
            className="w-full rounded-lg border border-border bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent/50 focus:outline-none"
          />
          <button
            onClick={() => void saveVersion.mutate()}
            disabled={saveVersion.isPending}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-[12.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            <Camera size={13} />
            {t("ver.save")}
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {isLoading ? (
            <p className="text-[13px] text-text-secondary">{t("common.loading")}</p>
          ) : versions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-[13px] text-text-secondary">
              {t("ver.empty")}
            </p>
          ) : (
            versions.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface-base px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-text-primary">
                    {v.label || `#${v.id}`}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {v.definition.nodes.length} nœuds ·{" "}
                    {new Date(v.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() => void restoreVersion.mutate(v.id)}
                  disabled={restoreVersion.isPending}
                  title={t("ver.restore")}
                  className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-accent/15 hover:text-accent-hover"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}