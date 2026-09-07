"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function NewWorkflowPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const wf = await api.createWorkflow({
          name: "Sans titre",
          definition: { nodes: [], edges: [] },
        });
        router.replace(`/workflows/${wf.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Création impossible");
      }
    })();
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center text-sm text-text-secondary">
      {error ? (
        <span className="text-error">{error}</span>
      ) : (
        <span>Création du workflow…</span>
      )}
    </div>
  );
}