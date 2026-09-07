"use client";

import { useEffect } from "react";
import { Check, Cloud, Play, Save, Workflow } from "lucide-react";
import { WorkflowCanvas } from "./workflow-canvas";
import { NodePalette } from "./node-palette";
import {
  useAutosave,
  useWorkflowPersistence,
} from "@/hooks/use-workflow";
import { useRunWorkflow } from "@/hooks/use-run-workflow";
import { useExecutionStore } from "@/stores/execution-store";
import { useUiStore } from "@/stores/ui-store";

export function WorkflowBuilder({ workflowId }: { workflowId: number }) {
  const { dirty, name, save, load } = useWorkflowPersistence();
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const execStatus = useExecutionStore((s) => s.status);
  const { execute, stopStream } = useRunWorkflow();

  useEffect(() => {
    void load(workflowId);
    // Hydratation une seule fois par montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId]);

  // Autosave uniquement quand un workflow est chargé (id != null).
  useAutosave();

  const running = execStatus === "running";
  const execLabel =
    execStatus === "running"
      ? "En cours…"
      : execStatus === "success"
        ? "Succès"
        : execStatus === "error"
          ? "Erreur"
          : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-surface-raised px-4 py-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/12 text-accent-hover">
          <Workflow size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-text-primary">
            {name}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            {dirty ? (
              <>
                <Cloud size={11} />
                Modifications non enregistrées
              </>
            ) : (
              <>
                <Check size={11} className="text-success" />
                Enregistré
              </>
            )}
          </p>
        </div>

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
          <span className="text-text-secondary/70">Rechercher</span>
          <kbd className="rounded bg-surface-menu px-1.5 py-0.5 font-mono text-[10px]">
            Ctrl K
          </kbd>
        </button>
        {running ? (
          <button
            type="button"
            onClick={stopStream}
            className="inline-flex items-center gap-2 rounded-lg border border-error/40 bg-error/10 px-3 py-1.5 text-[12.5px] font-medium text-error transition-colors hover:bg-error/20"
          >
            Arrêter
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void execute(workflowId)}
            className="inline-flex items-center gap-2 rounded-lg bg-success px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:opacity-90"
          >
            <Play size={14} />
            Exécuter
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
          Enregistrer
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
    </div>
  );
}