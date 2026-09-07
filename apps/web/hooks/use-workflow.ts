"use client";

import { useCallback, useEffect } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { api } from "@/lib/api-client";
import type { WorkflowCreate } from "@flowmind/shared";

/**
 * Persistance d'un workflow : hydrate depuis l'API (GET) et sauvegarde (POST/PATCH).
 * Chaque opération VM-to-API passe par le sérialiseur Zod partagé.
 */
export function useWorkflowPersistence() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const workflowId = useWorkflowStore((s) => s.workflowId);
  const name = useWorkflowStore((s) => s.workflowName);
  const dirty = useWorkflowStore((s) => s.dirty);
  const setWorkflowMeta = useWorkflowStore((s) => s.setWorkflowMeta);
  const markSaved = useWorkflowStore((s) => s.markSaved);
  const reset = useWorkflowStore((s) => s.reset);
  const setGraph = useWorkflowStore((s) => s.setGraph);

  /** Charge un workflow depuis l'API (ou repart d'un graphe vide). */
  const load = useCallback(
    async (id: number) => {
      reset();
      try {
        const wf = await api.getWorkflow(id);
        setWorkflowMeta(wf.id, wf.name);
        setGraph(wf.definition.nodes ?? [], wf.definition.edges ?? []);
      } catch (err) {
        console.error("Impossible de charger le workflow", err);
      }
    },
    [reset, setWorkflowMeta, setGraph]
  );

  /** Crée un workflow vierge et garde l'id retourné par l'API. */
  const createNew = useCallback(async () => {
    reset();
    const wf = await api.createWorkflow({
      name: "Sans titre",
      definition: { nodes: [], edges: [] },
    });
    setWorkflowMeta(wf.id, wf.name);
  }, [reset, setWorkflowMeta]);

  /** Sauvegarde le graphe courant (création ou mise à jour). */
  const save = useCallback(async () => {
    const parsed = useWorkflowStore
      .getState()
      .serialize();

    if (!parsed.success) {
      console.error("Graphe invalide", parsed.error);
      return false;
    }

    const payload: WorkflowCreate = {
      name,
      definition: parsed.data,
    };

    if (workflowId === null) {
      const wf = await api.createWorkflow(payload);
      setWorkflowMeta(wf.id, wf.name);
    } else {
      await api.updateWorkflow(workflowId, payload);
    }
    markSaved();
    return true;
  }, [name, workflowId, setWorkflowMeta, markSaved]);

  return { nodes, edges, dirty, workflowId, name, load, createNew, save };
}

/** Autosave différé sur les modifications du graphe. */
export function useAutosave(delayMs = 1500) {
  const dirty = useWorkflowStore((s) => s.dirty);
  const workflowId = useWorkflowStore((s) => s.workflowId);
  const { save } = useWorkflowPersistence();

  useEffect(() => {
    if (!dirty || workflowId === null) return;
    const handle = setTimeout(() => {
      void save();
    }, delayMs);
    return () => clearTimeout(handle);
  }, [dirty, workflowId, delayMs, save]);
}