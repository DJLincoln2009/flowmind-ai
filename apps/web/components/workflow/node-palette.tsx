"use client";

"use client";

import type { DragEvent } from "react";
import { NODE_META, PALETTE_ORDER, type FlowNode } from "@/lib/nodes";
import { useI18n } from "@/lib/i18n";

const CATEGORY_KEY: Record<string, string> = {
  déclencheur: "cat.trigger",
  IA: "cat.ai",
  données: "cat.data",
  logique: "cat.logic",
};

function PaletteItem({ type }: { type: FlowNode["type"] }) {
  const { t } = useI18n();
  const meta = NODE_META[type];
  const Icon = meta.icon;
  const label = t(`node.${type}`);
  const category = t(CATEGORY_KEY[meta.category] ?? meta.category);

  const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("application/flowmind", `flowmind:node:${type}`);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      title={meta.description}
      className={[
        "group flex items-center gap-2.5 rounded-lg border border-border",
        "bg-surface-base px-2.5 py-2 text-left",
        "transition-all duration-150 hover:border-accent/50 hover:bg-surface-raised",
        "cursor-grab active:cursor-grabbing",
      ].join(" ")}
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent/12 text-accent-hover transition-colors group-hover:bg-accent/20">
        <Icon size={14} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-text-primary">{label}</p>
        <p className="truncate text-[11px] text-text-secondary">{category}</p>
      </div>
    </button>
  );
}

export function NodePalette() {
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col gap-2 p-3" role="listbox" aria-label={t("builder.palette")}>
      <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
        {t("builder.palette")}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {PALETTE_ORDER.map((type) => (
          <PaletteItem key={type} type={type} />
        ))}
      </div>
    </div>
  );
}