"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Cloud,
  History,
  Play,
  Redo2,
  Save,
  Undo2,
  Workflow,
} from "lucide-react";
import { WorkflowCanvas } from "./workflow-canvas";
import { NodePalette } from "./node-palette";
import { ScheduleDialog } from "./schedule-dialog";
import { AgenticDialog } from "./agentic-dialog";
import { VersionsDialog } from "./versions-dialog";
import { PublishDialog } from "./publish-dialog";
import {
  useAutosave,
  useWorkflowPersistence,
} from "@/hooks/use-workflow";
import { useRunWorkflow } from "@/hooks/use-run-workflow";
import { useExecutionStore } from "@/stores/execution-store";
import { useUiStore } from "@/stores/ui-store";
import { useI18n } from "@/lib/i18n";
import { useWorkflowStore } from "@/stores/workflow-store";

export function WorkflowBuilder({ workflowId }: { workflowId: number }) {
  const { t } = useI18n();
  const { dirty, name, save, load } = useWorkflowPersistence();
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const execStatus = useExecutionStore((s) => s.status);
  const { execute, stopStream } = useRunWorkflow();
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const canUndo = useWorkflowStore((s) => s.past.length > 0);
  const canRedo = useWorkflowStore((s) => s.future.length > 0);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  useEffect(() => {
    void load(workflowId);
    // Hydratation une seule fois par montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId]);

  useAutosave();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      if (key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (key === "z") {
        e.preventDefault();
        undo();
      } else if (key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const running = execStatus === "running";
  const execLabel =
    execStatus === "running"
      ? t("status.running")
      : execStatus === "success"
        ? t("status.success")
        : execStatus === "error"
          ? t("status.failed")
          : null;

  const iconBtn =
    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-base px-2.5 py-1.5 text-[12.5px] text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-border bg-surface-raised px-4 py-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/12 text-accent-hover">
          <Workflow size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-text-primary">{name}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            {dirty ? (
              <>
                <Cloud size={11} />
                {t("builder.edited")}
              </>
            ) : (
              <>
                <Check size={11} className="text-success" />
                {t("builder.saved")}
              </>
            )}
          </p>
        </div>

        {/* Historique (undo/redo) */}
        <button type="button" onClick={undo} disabled={!canUndo} title={t("builder.undo")} className={iconBtn}>
          <Undo2 size={13} />
        </button>
        <button type="button" onClick={redo} disabled={!canRedo} title={t("builder.redo")} className={iconBtn}>
          <Redo2 size={13} />
        </button>
        <button
          type="button"
          onClick={() => setVersionsOpen(true)}
          title={t("builder.versions")}
          className={iconBtn}
        >
          <History size={13} />
        </button>

        {execLabel && (
          <span
            className={[
              "rounded-md px-2 py-1 text-[11px] font-medium",
              execStatus === "success" && "bg-success/15 text-success",
              execStatus === "error" && "bg-error/15 text-error",
              running && "bg-accent/15 text-accent-hover animate-pulse",
            ].join(" ")}
          >
            {execLabel}
          </span>
        )}

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          title="Palette de commandes (Ctrl+K)"
          className="hidden items-center gap-2 rounded-lg border border-border bg-surface-base px-3 py-1.5 text-[12.5px] text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary sm:flex"
        >
          <span className="text-text-secondary/70">Ctrl K</span>
        </button>
        <ScheduleDialog workflowId={workflowId} />
        <AgenticDialog />
        <button
          type="button"
          onClick={() => setPublishOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/8 px-2.5 py-1.5 text-[12.5px] font-medium text-accent-hover transition-colors hover:bg-accent/15"
        >
          {t("builder.publish")}
        </button>
        {running ? (
          <button
            type="button"
            onClick={stopStream}
            className="inline-flex items-center gap-2 rounded-lg border border-error/40 bg-error/10 px-3 py-1.5 text-[12.5px] font-medium text-error transition-colors hover:bg-error/20"
          >
            {t("builder.run")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void execute(workflowId)}
            className="inline-flex items-center gap-2 rounded-lg bg-success px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:opacity-90"
          >
            <Play size={14} />
            {t("builder.run")}
          </button>
        )}
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty}
          title="Enregistrer (Ctrl+S)"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save size={14} />
          {t("builder.save")}
        </button>
      </header>

      {/* Body: palette + canvas */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[240px] shrink-0 border-r border-border bg-surface-raised">
          <NodePalette />
        </div>
        <div className="relative flex-1 overflow-hidden bg-surface-base">
          <WorkflowCanvas />
        </div>
      </div>

      {versionsOpen && (
        <VersionsDialog workflowId={workflowId} onClose={() => setVersionsOpen(false)} />
      )}
      {publishOpen && (
        <PublishDialog workflowName={name} onClose={() => setPublishOpen(false)} />
      )}
    </div>
  );
}