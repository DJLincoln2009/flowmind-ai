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

interface GraphSnapshot {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  workflowId: number | null;
  workflowName: string;
  dirty: boolean;
  past: GraphSnapshot[];
  future: GraphSnapshot[];

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Partial<Record<string, unknown>>) => void;
  setGraph: (nodes: Node[], edges: Edge[], opts?: { dirty?: boolean }) => void;
  setWorkflowMeta: (id: number | null, name: string) => void;
  markSaved: () => void;
  markDirty: () => void;
  undo: () => void;
  redo: () => void;
  serialize: () => ReturnType<typeof WorkflowDefinitionSchema.safeParse>;
  reset: () => void;
}

const HISTORY_CAP = 50;

function graphSignature(s: { nodes: Node[]; edges: Edge[] }) {
  const nodeSig = s.nodes
    .map((n) =>
      [n.id, n.type, n.position?.x, n.position?.y, JSON.stringify(n.data ?? {})].join("|")
    )
    .join("\n");
  const edgeSig = s.edges
    .map((e) =>
      [e.id, e.source, e.target, e.sourceHandle ?? "", e.targetHandle ?? ""].join(":")
    )
    .join("~");
  return `${nodeSig}\n${edgeSig}`;
}

/** Pousse l'état courant dans la pile "past" avant toute mutation. */
function checkpoint(s: WorkflowState): GraphSnapshot {
  return { nodes: s.nodes, edges: s.edges };
}

function commit(state: WorkflowState, next: Partial<WorkflowState>): Partial<WorkflowState> {
  const snap = checkpoint(state);
  const last = state.past[state.past.length - 1];
  const unchanged = last && graphSignature(last) === graphSignature(snap);
  if (last && unchanged) {
    return { ...next, future: [], dirty: true };
  }
  const past =
    state.nodes.length > 0 || state.edges.length > 0
      ? [...state.past.slice(-(HISTORY_CAP - 1)), snap]
      : state.past;
  return { ...next, past, future: [], dirty: true };
}

export const useWorkflowStore = create<WorkflowState>()((set, get) => ({
  nodes: [],
  edges: [],
  workflowId: null,
  workflowName: "Sans titre",
  dirty: false,
  past: [],
  future: [],

  onNodesChange: (changes) =>
    set((s) => {
      const hasUserChange = changes.some((c) => c.type !== "dimensions");
      const nodes = applyNodeChanges(changes, s.nodes);
      if (!hasUserChange) return { nodes, dirty: s.dirty };
      return commit(s, { nodes });
    }),
  onEdgesChange: (changes) =>
    set((s) => commit(s, { edges: applyEdgeChanges(changes, s.edges) })),
  onConnect: (connection: Connection) =>
    set((s) => commit(s, { edges: addEdge(connection, s.edges) })),

  addNode: (node) => set((s) => commit(s, { nodes: [...s.nodes, node] })),

  updateNodeData: (id, data) =>
    set((s) =>
      commit(s, {
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...data } } : n
        ),
      })
    ),

  setGraph: (nodes, edges, opts) =>
    set({ nodes, edges, dirty: opts?.dirty ?? false, past: [], future: [] }),

  setWorkflowMeta: (workflowId, workflowName) => set({ workflowId, workflowName }),
  markSaved: () => set({ dirty: false }),
  markDirty: () => set({ dirty: true }),

  undo: () => {
    const { past, nodes, edges } = get();
    const previous = past[past.length - 1];
    if (!previous) return;
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: past.slice(0, -1),
      future: [...get().future, { nodes, edges }],
      dirty: true,
    });
  },

  redo: () => {
    const { future, nodes, edges } = get();
    const next = future[future.length - 1];
    if (!next) return;
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(0, -1),
      past: [...get().past, { nodes, edges }],
      dirty: true,
    });
  },

  serialize: () => {
    const { nodes, edges } = get();
    const def = { nodes, edges };
    return WorkflowDefinitionSchema.safeParse(def);
  },

  reset: () =>
    set({
      nodes: [],
      edges: [],
      workflowId: null,
      workflowName: "Sans titre",
      dirty: false,
      past: [],
      future: [],
    }),
}));

export function useUndoRedoShortcuts() {
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  // Branché depuis un hook dédié (réagit à l'état : undo/redo sont stables).
  return { undo, redo };
}