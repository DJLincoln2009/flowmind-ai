import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useExecutionStore } from "@/stores/execution-store";

/**
 * Lance l'exécution d'un workflow et branche le flux SSE sur le store
 * d'exécution (statut des nœuds en temps réel sur le canvas).
 */
export function useRunWorkflow() {
  const esRef = useRef<EventSource | null>(null);
  const run = useExecutionStore((s) => s.run);
  const nodeUpdated = useExecutionStore((s) => s.nodeUpdated);
  const setStatus = useExecutionStore((s) => s.setStatus);
  const reset = useExecutionStore((s) => s.reset);

  const stopStream = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
  }, []);

  const execute = useCallback(
    async (workflowId: number) => {
      stopStream();
      run();
      try {
        const { execution_id } = await api.runWorkflow(workflowId);
        const es = api.streamExecution(execution_id, {
          onStart: () => {
            toast.info("Exécution lancée", {
              description: "Suivi en direct sur le canvas.",
            });
          },
          onNode: ({ node_id, status, output, error }) => {
            const mapped =
              status === "running"
                ? "running"
                : status === "success"
                  ? "success"
                  : "error";
            nodeUpdated(node_id, mapped);
            console.info(`[exec] ${node_id}: ${status}`, output ?? error);
          },
          onEnd: ({ status }) => {
            setStatus(status === "success" ? "success" : "error");
            if (status === "success") {
              toast.success("Workflow terminé avec succès");
            } else {
              toast.error("Workflow terminé en échec");
            }
            stopStream();
          },
          onError: () => {
            toast.error("Erreur de connexion au flux d'exécution");
            stopStream();
          },
        });
        esRef.current = es;
      } catch (err) {
        reset();
        toast.error("Impossible de lancer l'exécution");
        console.error("Échec du lancement de l'exécution", err);
      }
    },
    [run, nodeUpdated, setStatus, reset, stopStream]
  );

  return { execute, stopStream };
}