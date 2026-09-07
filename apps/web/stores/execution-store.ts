import { create } from "zustand";
import type { ExecutionStatus } from "@flowmind/shared";

type WorkingState = "idle" | "pending" | "running" | "success" | "error";

interface ExecutionState {
  status: WorkingState;
  nodeStates: Record<string, ExecutionStatus>;
  error: string | null;
  lastRunAt: number | null;

  run: () => void;
  nodeUpdated: (nodeId: string, status: ExecutionStatus) => void;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>()((set) => ({
  status: "idle",
  nodeStates: {},
  error: null,
  lastRunAt: null,

  run: () => set({ status: "running", nodeStates: {}, error: null }),
  nodeUpdated: (nodeId, status) =>
    set((s) => ({
      status,
      nodeStates: { ...s.nodeStates, [nodeId]: status },
    })),
  reset: () => set({ status: "idle", nodeStates: {}, error: null, lastRunAt: Date.now() }),
}));