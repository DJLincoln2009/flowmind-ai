"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2, Sparkles, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";
import type { AgenticPlan } from "@flowmind/shared";

const NODE_LABELS: Record<string, string> = {
  trigger: "node.trigger",
  ai_summary: "node.ai_summary",
  ai_extract: "node.ai_extract",
  ai_classify: "node.ai_classify",
  ocr: "node.ocr",
  transcription: "node.transcription",
  http_request: "node.http_request",
  delay: "node.delay",
  condition: "node.condition",
  output: "node.output",
};

const OBJECTIVE_EXAMPLES = [
  "Extraire les factures reçues par e-mail et les classer par fournisseur",
  "Récupérer le texte d'une page web de presse et le résumer chaque matin",
  "Classer les avis clients reçus en positif, neutre ou négatif",
];

export function AgenticDialog() {
  const { t } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [objective, setObjective] = useState("");
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [plan, setPlan] = useState<AgenticPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const close = () => {
    setOpen(false);
    setGenerating(false);
    setCreating(false);
    setPlan(null);
    setError(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const generate = async () => {
    if (objective.trim().length < 10) {
      setError(t("agentic.error"));
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const generated = await api.generateAgenticPlan(objective.trim());
      setPlan(generated);
    } catch {
      setError(t("agentic.error"));
    } finally {
      setGenerating(false);
    }
  };

  const create = async () => {
    if (!plan) return;
    setCreating(true);
    try {
      const wf = await api.createWorkflow({
        name: plan.name,
        description: plan.description,
        definition: plan.definition,
      });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success(`${t("agentic.plan")} : ${plan.definition.nodes.length} nœuds`);
      close();
      router.push(`/workflows/${wf.id}`);
    } catch {
      toast.error(t("common.error"));
      setCreating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        title={t("agentic.title")}
        className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-[12.5px] font-medium text-accent-hover transition-colors hover:border-accent/70 hover:bg-accent/15"
      >
        <Sparkles size={14} />
        {t("builder.agentic")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={t("agentic.title")}
        >
          <button
            aria-label={t("agentic.close")}
            onClick={close}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface-overlay shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="flex items-center gap-2 text-[14.5px] font-semibold text-text-primary">
                  <Wand2 size={15} className="text-accent-hover" />
                  {t("builder.agentic")}
                </p>
                <p className="text-[12px] text-text-secondary">
                  {t("agentic.desc")}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t("agentic.close")}
                className="rounded-md p-1 text-text-secondary transition-colors hover:text-text-primary"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-5 py-4">
              {!plan ? (
                <>
                  <div>
                    <label
                      htmlFor="agentic-objective"
                      className="mb-1.5 block text-[12px] font-medium text-text-secondary"
                    >
                      {t("agentic.title")}
                    </label>
                    <textarea
                      id="agentic-objective"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      rows={3}
                      placeholder={t("agentic.placeholder")}
                      className="w-full resize-none rounded-lg border border-border bg-surface-base px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent/60 focus:outline-none"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {OBJECTIVE_EXAMPLES.map((ex) => (
                        <button
                          key={ex}
                          type="button"
                          onClick={() => setObjective(ex)}
                          className="max-w-full truncate rounded-md border border-border bg-surface-base px-2 py-1 text-[11px] text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[12.5px] text-error">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => void generate()}
                    disabled={generating || objective.trim().length < 10}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-[12.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        {t("agentic.generating")}
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        {t("agentic.generate")}
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">
                      {plan.name}
                    </p>
                    {plan.description && (
                      <p className="mt-0.5 text-[12.5px] text-text-secondary">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {plan.definition.nodes.map((n, i) => (
                      <span
                        key={n.id}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-base px-2 py-1 text-[11px] text-text-secondary"
                      >
                        {t(NODE_LABELS[n.type] ?? n.type)}
                        {i < plan.definition.nodes.length - 1 && (
                          <ArrowRight size={10} className="text-text-secondary/60" />
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 border-t border-border pt-3.5">
                    <button
                      type="button"
                      onClick={() => setPlan(null)}
                      disabled={creating}
                      className="rounded-lg border border-border bg-surface-base px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {t("agentic.close")}
                    </button>
                    <button
                      type="button"
                      onClick={() => void create()}
                      disabled={creating}
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                    >
                      {creating ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Sparkles size={13} />
                      )}
                      {t("agentic.create")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}