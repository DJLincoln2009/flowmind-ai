import { describe, expect, it } from "vitest";
import { useWorkflowStore } from "../stores/workflow-store";

function makeNode(id: string) {
  return {
    id,
    type: "ai_summary" as const,
    position: { x: 0, y: 0 },
    data: { label: id },
  };
}

describe("workflow-store undo/redo", () => {
  it("annule et rétablit l'ajout de nœuds", () => {
    useWorkflowStore.getState().reset();
    const store = useWorkflowStore.getState();

    store.setGraph([makeNode("a")], [], { dirty: false });
    expect(useWorkflowStore.getState().nodes.length).toBe(1);

    useWorkflowStore.getState().addNode(makeNode("b"));
    expect(useWorkflowStore.getState().nodes.length).toBe(2);
    expect(useWorkflowStore.getState().past.length).toBe(1);

    useWorkflowStore.getState().undo();
    expect(useWorkflowStore.getState().nodes.length).toBe(1);
    expect(useWorkflowStore.getState().future.length).toBe(1);

    useWorkflowStore.getState().redo();
    expect(useWorkflowStore.getState().nodes.length).toBe(2);
    expect(useWorkflowStore.getState().past.length).toBe(1);
  });

  it("undo sans historique ne casse pas", () => {
    useWorkflowStore.getState().reset();
    useWorkflowStore.getState().undo();
    useWorkflowStore.getState().redo();
    expect(useWorkflowStore.getState().nodes.length).toBe(0);
  });
});