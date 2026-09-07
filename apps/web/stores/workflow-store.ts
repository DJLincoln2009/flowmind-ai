import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  OnConnect,
} from "@xyflow/react";
import { WorkflowDefinitionSchema } from "@flowmind/shared";

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  workflowId: number | null;
  workflowName: string;
  dirty: boolean;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Partial<Record<string, unknown>>) => void;
  setGraph: (nodes: Node[], edges: Edge[]) => void;
  setWorkflowMeta: (id: number | null, name: string) => void;
  markSaved: () => void;
  serialize: () => ReturnType<typeof WorkflowDefinitionSchema.safeParse>;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowState>()((set, get) => ({
  nodes: [],
  edges: [],
  workflowId: null,
  workflowName: "Sans titre",
  dirty: false,

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes), dirty: true })),
  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges), dirty: true })),
  onConnect: (connection: Connection) =>
    set((s) => ({ edges: addEdge(connection, s.edges), dirty: true })),

  addNode: (node) =>
    set((s) => ({ nodes: [...s.nodes, node], dirty: true })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
      dirty: true,
    })),

  setGraph: (nodes, edges) => set({ nodes, edges, dirty: false }),
  setWorkflowMeta: (workflowId, workflowName) => set({ workflowId, workflowName }),
  markSaved: () => set({ dirty: false }),

  serialize: () => {
    const { nodes, edges } = get();
    const def = { nodes, edges };
    return WorkflowDefinitionSchema.safeParse(def);
  },

  reset: () =>
    set({ nodes: [], edges: [], workflowId: null, workflowName: "Sans titre", dirty: false }),
}));