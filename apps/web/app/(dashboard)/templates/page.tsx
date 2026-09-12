"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AudioLines,
  Braces,
  FileText,
  Globe,
  LayoutTemplate,
  ScanText,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";
import type { WorkflowTemplate } from "@flowmind/shared";

const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  Braces,
  Sparkles,
  FileText,
  Globe,
  ScanText,
  AudioLines,
};

function TemplateCard({
  template,
  onUse,
  allowDelete,
}: {
  template: WorkflowTemplate;
  onUse: (t: WorkflowTemplate) => void;
  allowDelete?: boolean;
}) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const Icon = TEMPLATE_ICONS[template.icon] ?? LayoutTemplate;

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteTemplate(template.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(t("tpl.deleted"));
    },
    onError: () => toast.error(t("common.error")),
  });

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 transition-all duration-150 hover:border-accent/40">
      <div className="flex items-start justify-between gap-2">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent-hover">
          <Icon size={16} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-border bg-surface-base px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-text-secondary">
            {template.category}
          </span>
          {allowDelete && (
            <button
              onClick={() => void deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              title={t("wf.delete")}
              className="rounded-md p-1 text-text-secondary opacity-0 transition-all hover:bg-error/15 hover:text-error group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
      <div>
        <p className="truncate text-[14px] font-medium text-text-primary">{template.name}</p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-text-secondary">
          {template.description}
        </p>
      </div>
      <div className="mt-auto flex items-center gap-1.5 text-[11.5px] text-text-secondary">
        {template.definition.nodes.length} nœuds
        <span className="text-border">·</span>
        {template.definition.edges.length} connexions
      </div>
      <button
        type="button"
        onClick={() => onUse(template)}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-accent-hover"
      >
        {t("tpl.use")}
      </button>
    </div>
  );
}

export default function TemplatesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"gallery" | "mine">("gallery");

  const { data: templates, isLoading, isError } = useQuery({
    queryKey: ["templates"],
    queryFn: () => api.listTemplates(),
  });

  const useTemplate = useMutation({
    mutationFn: (tpl: WorkflowTemplate) =>
      api.createWorkflow({
        name: tpl.name,
        description: tpl.description,
        definition: tpl.definition,
      }),
    onSuccess: (wf) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success(t("tpl.added"));
      router.push(`/workflows/${wf.id}`);
    },
    onError: () => toast.error(t("common.error")),
  });

  const gallery = (templates ?? []).filter((x) => x.source === "builtin");
  const mine = (templates ?? []).filter((x) => x.source === "user");
  const visible = tab === "gallery" ? gallery : mine;

  const tabBtn = (active: boolean) =>
    [
      "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
      active
        ? "bg-accent/12 text-accent-hover"
        : "text-text-secondary hover:bg-surface-raised hover:text-text-primary",
    ].join(" ");

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">{t("tpl.title")}</h1>
          <p className="text-[13px] text-text-secondary">{t("tpl.subtitle")}</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-surface-base p-1">
          <button className={tabBtn(tab === "gallery")} onClick={() => setTab("gallery")}>
            {t("tpl.gallery")}
          </button>
          <button className={tabBtn(tab === "mine")} onClick={() => setTab("mine")}>
            {t("tpl.mine")}
          </button>
        </div>
      </div>

      {isError && (
        <p className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
          {t("common.error")}
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-surface-raised" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <LayoutTemplate size={22} className="text-text-secondary" />
          <p className="text-sm font-medium text-text-primary">
            {tab === "mine" ? t("tpl.empty") : t("wf.empty.title")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onUse={(item) => useTemplate.mutate(item)}
              allowDelete={tab === "mine"}
            />
          ))}
        </div>
      )}
    </div>
  );
}