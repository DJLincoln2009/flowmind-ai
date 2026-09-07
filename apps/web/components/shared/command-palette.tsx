"use client";

import { useEffect, useCallback } from "react";
import { useUiStore } from "@/stores/ui-store";

export function CommandPalette() {
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);

  const togglePalette = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!useUiStore.getState().commandOpen);
      }
      if (e.key === "Escape" && useUiStore.getState().commandOpen) {
        setOpen(false);
      }
    },
    [setOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", togglePalette);
    return () => window.removeEventListener("keydown", togglePalette);
  }, [togglePalette]);

  const close = () => setOpen(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Palette de commandes"
    >
      {/* Backdrop */}
      <button
        aria-label="Fermer"
        onClick={close}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface-overlay shadow-2xl">
        <input
          autoFocus
          type="text"
          placeholder="Rechercher un workflow, taper / pour l'IA…"
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-[14px] text-text-primary placeholder:text-text-secondary focus:outline-none"
        />
        <div className="max-h-80 overflow-y-auto p-2 text-[13.5px] text-text-secondary">
          <p className="px-3 py-2">
            Tapez <kbd className="rounded bg-surface-menu px-1.5 py-0.5 font-mono text-[11px]">/</kbd>{" "}
            pour lancer une commande IA, ou cherchez un workflow.
          </p>
        </div>
      </div>
    </div>
  );
}