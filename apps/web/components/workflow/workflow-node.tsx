"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ExecutionStatus } from "@flowmind/shared";
import { useExecutionStore } from "@/stores/execution-store";
import { NODE_META, type FlowNodeProps } from "@/lib/nodes";

const STATUS_STYLES: Record<
  ExecutionStatus | "idle",
  { label: string; className: string }
> = {
  idle: { label: "Prêt", className: "bg-surface-menu text-text-secondary" },
  pending: { label: "En attente", className: "bg-surface-menu text-text-secondary" },
  running: {
    label: "En cours",
    className: "bg-accent/15 text-accent-hover",
  },
  success: { label: "Succès", className: "bg-success/15 text-success" },
  error: { label: "Erreur", className: "bg-error/15 text-error" },
};

/**
 * Nœud générique FlowMind — un seul composant thématisé pour toutes les types.
 * Les Handles target (haut) / source (bas) suivent les conventions @xyflow/react.
 */
export const WorkflowNode = memo(function WorkflowNode({
  id,
  data,
  selected,
  type,
}: FlowNodeProps) {
  const meta = NODE_META[type];
  const status = useExecutionStore((s) => s.nodeStates[id] ?? "idle");

  if (!meta) {
    return (
      <div className="min-w-44 rounded-xl border border-error/40 bg-error/5 p-4 text-sm text-error">
        Type inconnu : « {String(type)} »
      </div>
    );
  }

  const Icon = meta.icon;
  const statusMeta = STATUS_STYLES[status];

  return (
    <div
      className={[
        "relative min-w-50 rounded-xl border bg-surface-raised p-3",
        "transition-all duration-150",
        selected
          ? "border-accent/80 shadow-[0_0_0_3px_var(--color-accent)/0.25]"
          : "border-border hover:border-text-secondary/40",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !rounded-full !border-surface-raised"
      />
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent-hover">
          <Icon size={16} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-text-primary">
            {String(data.label ?? meta.label)}
          </p>
          <p className="truncate text-[11px] text-text-secondary">{meta.category}</p>
        </div>
        <span
          className={[
            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
            statusMeta.className,
          ].join(" ")}
        >
          {statusMeta.label}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !rounded-full !border-surface-raised"
      />
    </div>
  );
});