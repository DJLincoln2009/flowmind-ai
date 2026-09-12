"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Megaphone, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";
import { useWorkflowStore } from "@/stores/workflow-store";

const ICONS = [
  "LayoutTemplate",
  "Rocket",
  "CloudUpload",
  "Sparkles",
  "FileText",
  "Bot",
];

export function PublishDialog({
  workflowName,
  onClose,
}: {
  workflowName: string;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [name, setName] = useState(workflowName);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("automatisation");
  const [icon, setIcon] = useState("LayoutTemplate");

  const publishMutation = useMutation({
    mutationFn: () => {
      const parsed = useWorkflowStore.getState().serialize();
      if (!parsed.success) throw new Error("Graphe invalide");
      return api.publishTemplate({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        icon,
        definition: parsed.data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      onClose();
      toast.success(t("tpl.listed"));
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

  const inputCls =
    "w-full rounded-lg border border-border bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent/50 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-label={t("tpl.publishDialog")}
        className="w-full max-w-md rounded-2xl border border-border bg-surface-raised p-5 shadow-xl shadow-black/20"
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-text-primary">
            <Megaphone size={16} className="text-accent-hover" />
            {t("tpl.publishDialog")}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary"
          >
            <X size={15} />
          </button>
        </div>
        <p className="mb-4 text-[12.5px] text-text-secondary">{t("tpl.publish.desc")}</p>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-text-secondary">
              {t("props.name")}
            </span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-text-secondary">
              {t("props.desc")}
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-text-secondary">Catégorie</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-text-secondary">Icône</span>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className={inputCls}
              >
                {ICONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-surface-base px-3.5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            {t("agentic.close")}
          </button>
          <button
            onClick={() => void publishMutation.mutate()}
            disabled={publishMutation.isPending || !name.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            <Megaphone size={14} />
            {t("builder.publish")}
          </button>
        </div>
      </div>
    </div>
  );
}