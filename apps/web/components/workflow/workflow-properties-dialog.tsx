"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Folder, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";
import type { Workflow } from "@flowmind/shared";

interface WorkflowPropertiesDialogProps {
  workflowId: number;
  onClose: () => void;
  onSaved?: () => void;
}

function PropertiesForm({
  workflow,
  onClose,
  onSaved,
}: {
  workflow: Workflow;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(workflow.name);
  const [description, setDescription] = useState(workflow.description ?? "");
  const [folder, setFolder] = useState(workflow.folder ?? "");
  const [tags, setTags] = useState<string[]>(workflow.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const { data: allFolders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: () => api.listFolders(),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      api.updateWorkflow(workflow.id, {
        name: name.trim(),
        description: description.trim(),
        folder: folder.trim() || null,
        tags,
      }),
    onSuccess: () => {
      toast.success(t("props.save"));
      onClose();
      onSaved?.();
    },
    onError: () => toast.error(t("common.error")),
  });

  const addTag = () => {
    const value = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (value && !tags.includes(value) && tags.length < 10) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  };

  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent/50 focus:outline-none";

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-text-secondary">{t("props.name")}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-text-secondary">{t("props.desc")}</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1 text-[12px] font-medium text-text-secondary">
          <Folder size={12} /> {t("props.folder")}
        </span>
        <input
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          list="folders-suggestions"
          placeholder={t("props.folder.hint")}
          className={inputCls}
        />
        <datalist id="folders-suggestions">
          {allFolders.map((f) => (
            <option key={f} value={f} />
          ))}
        </datalist>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1 text-[12px] font-medium text-text-secondary">
          <Tag size={12} /> {t("props.tags")}
        </span>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tg) => (
              <span
                key={tg}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-base px-2 py-0.5 text-[11px] text-text-secondary"
              >
                #{tg}
                <button
                  onClick={() => setTags((prev) => prev.filter((x) => x !== tg))}
                  className="text-text-secondary hover:text-error"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={onTagKeyDown}
          onBlur={addTag}
          placeholder={t("props.tags")}
          className={inputCls}
        />
      </label>

      <div className="mt-2 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-border bg-surface-base px-3.5 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          {t("wf.cancel")}
        </button>
        <button
          onClick={() => void updateMutation.mutate()}
          disabled={updateMutation.isPending || !name.trim()}
          className="rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          {t("props.save")}
        </button>
      </div>
    </div>
  );
}

export function WorkflowPropertiesDialog({
  workflowId,
  onClose,
  onSaved,
}: WorkflowPropertiesDialogProps) {
  const { t } = useI18n();
  const { data: workflow } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => api.getWorkflow(workflowId),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-label={t("props.title")}
        className="w-full max-w-md rounded-2xl border border-border bg-surface-raised p-5 shadow-xl shadow-black/20"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-text-primary">{t("props.title")}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary"
          >
            <X size={15} />
          </button>
        </div>

        {workflow ? (
          <PropertiesForm
            key={workflow.id}
            workflow={workflow}
            onClose={onClose}
            onSaved={onSaved}
          />
        ) : (
          <p className="text-[13px] text-text-secondary">{t("common.loading")}</p>
        )}
      </div>
    </div>
  );
}