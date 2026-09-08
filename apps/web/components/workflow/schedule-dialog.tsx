"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

const CRON_EXAMPLES = [
  { label: "Tous les jours à 9 h 00", value: "0 9 * * *" },
  { label: "Toutes les 30 minutes", value: "*/30 * * * *" },
  { label: "Lundi à vendredi à 8 h 30", value: "30 8 * * 1-5" },
  { label: "Chaque heure", value: "0 * * * *" },
];

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150",
        checked ? "bg-accent" : "bg-surface-menu",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-150",
          checked ? "left-[18px]" : "left-0.5",
        ].join(" ")}
      />
    </button>
  );
}

export function ScheduleDialog({ workflowId }: { workflowId: number }) {
  const [open, setOpen] = useState(false);
  const [cron, setCron] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nextRunAt, setNextRunAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const openDialog = useCallback(async () => {
    setOpen(true);
    setLoading(true);
    try {
      const wf = await api.getWorkflow(workflowId);
      setCron(wf.cron ?? "");
      setIsActive(wf.is_active ?? true);
      setNextRunAt(wf.next_run_at ?? null);
    } catch {
      toast.error("Impossible de charger la planification");
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  const close = () => setOpen(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateWorkflow(workflowId, {
        cron: cron.trim() === "" ? null : cron.trim(),
        is_active: isActive,
      });
      const wf = await api.getWorkflow(workflowId);
      setNextRunAt(wf.next_run_at ?? null);
      toast.success(
        wf.cron ? `Planifié : ${wf.cron}` : "Planification retirée"
      );
    } catch {
      toast.error("Expression cron invalide (minute heure jour mois semaine)");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => void openDialog()}
        title="Planification (cron)"
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-base px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
      >
        <CalendarClock size={14} />
        Planifier
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Planification du workflow"
        >
          <button
            aria-label="Fermer"
            onClick={close}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface-overlay shadow-2xl">
            <div className="border-b border-border px-5 py-4">
              <p className="text-[14.5px] font-semibold text-text-primary">
                Planification
              </p>
              <p className="text-[12px] text-text-secondary">
                Exécutez ce workflow automatiquement, sans ouvrir l’éditeur.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-5 py-4">
              <div>
                <label
                  htmlFor="cron-input"
                  className="mb-1.5 block text-[12px] font-medium text-text-secondary"
                >
                  Expression cron (5 champs)
                </label>
                <input
                  id="cron-input"
                  type="text"
                  value={cron}
                  onChange={(e) => setCron(e.target.value)}
                  placeholder="0 9 * * *"
                  disabled={!isActive || loading}
                  className="w-full rounded-lg border border-border bg-surface-base px-3 py-2 font-mono text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent/60 focus:outline-none disabled:opacity-50"
                />
                <p className="mt-1 text-[11px] text-text-secondary">
                  minute · heure · jour du mois · mois · jour de la semaine
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-surface-base px-3 py-2.5">
                <div>
                  <p className="text-[13px] font-medium text-text-primary">
                    Planification active
                  </p>
                  <p className="text-[11.5px] text-text-secondary">
                    Le workflow s’exécutera selon le cron ci-dessus.
                  </p>
                </div>
                <Switch checked={isActive} onChange={setIsActive} />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CRON_EXAMPLES.map((ex) => (
                  <button
                    key={ex.value}
                    type="button"
                    onClick={() => setCron(ex.value)}
                    className="rounded-md border border-border bg-surface-base px-2 py-1 text-[11px] text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {nextRunAt && (
                <p className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                  <CalendarClock size={12} className="text-accent-hover" />
                  Prochaine exécution :{" "}
                  <span className="font-medium text-text-primary">
                    {new Date(nextRunAt).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-border px-5 py-3.5">
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-border bg-surface-base px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}