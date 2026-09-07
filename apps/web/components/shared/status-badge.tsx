"use client";

import type { ExecutionStatus } from "@flowmind/shared";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

const STATUS_META: Record<
  ExecutionStatus,
  { label: string; icon: typeof Clock; classes: string; spin?: boolean }
> = {
  pending: {
    label: "En attente",
    icon: Clock,
    classes: "bg-info/12 text-info",
  },
  running: {
    label: "En cours",
    icon: Loader2,
    classes: "bg-accent/15 text-accent-hover",
    spin: true,
  },
  success: {
    label: "Succès",
    icon: CheckCircle2,
    classes: "bg-success/15 text-success",
  },
  error: {
    label: "Échec",
    icon: XCircle,
    classes: "bg-error/15 text-error",
  },
};

/** Pastille de statut d'exécution : couleur + icône + label. */
export function StatusBadge({ status }: { status: ExecutionStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11.5px] font-medium",
        meta.classes,
      ].join(" ")}
    >
      <Icon size={12} className={meta.spin ? "animate-spin" : undefined} />
      {meta.label}
    </span>
  );
}

/** Icône uniquement (pour cartes KPI et tableaux denses). */
export function StatusIcon({ status }: { status: ExecutionStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <Icon
      size={14}
      className={["shrink-0", meta.classes.replace(/^bg\S+\s+/, ""), meta.spin ? "animate-spin" : ""].join(" ")}
    />
  );
}