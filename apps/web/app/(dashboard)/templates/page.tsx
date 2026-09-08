"use client";

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
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { WorkflowTemplate } from "@flowmind/shared";

/** Map (nom -> icône Lucide) pour les icônes des templates renvoyées par l'API. */
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
}: {
  template: WorkflowTemplate;
  onUse: (t: WorkflowTemplate) => void;
}) {
  const Icon = TEMPLATE_ICONS[template.icon] ?? LayoutTemplate;

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 transition-all duration-150 hover:border-accent/40">
      <div className="flex items-start justify-between gap-2">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent-hover">
          <Icon size={16} />
        </div>
        <span className="rounded-md border border-border bg-surface-base px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-text-secondary">
          {template.category}
        </span>
      </div>
      <div>
        <p className="text-[14px] font-medium text-text-primary">{template.name}</p>
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
        Utiliser ce modèle
      </button>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: templates, isLoading, isError } = useQuery({
    queryKey: ["templates"],
    queryFn: () => api.listTemplates(),
  });

  const useTemplate = useMutation({
    mutationFn: (t: WorkflowTemplate) =>
      api.createWorkflow({
        name: t.name,
        description: t.description,
        definition: t.definition,
      }),
    onSuccess: (wf) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Modèle instancié");
      router.push(`/workflows/${wf.id}`);
    },
    onError: () => toast.error("Impossible d'instancier le modèle"),
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-text-primary">Modèles</h1>
        <p className="text-[13px] text-text-secondary">
          Démarrez un workflow prêt à l’emploi en un clic, puis personnalisez-le dans l’éditeur.
        </p>
      </div>

      {isError && (
        <p className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
          Impossible de charger les modèles
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-surface-raised" />
          ))}
        </div>
      ) : (templates?.length ?? 0) === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <LayoutTemplate size={22} className="text-text-secondary" />
          <p className="text-sm font-medium text-text-primary">Aucun modèle disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(templates ?? []).map((t) => (
            <TemplateCard key={t.id} template={t} onUse={(tpl) => useTemplate.mutate(tpl)} />
          ))}
        </div>
      )}
    </div>
  );
}