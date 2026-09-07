import { create } from "zustand";

interface UiState {
  commandOpen: boolean;
  sidebarCollapsed: boolean;
  inspectNodeId: string | null;

  setCommandOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setInspectNode: (id: string | null) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  commandOpen: false,
  sidebarCollapsed: false,
  inspectNodeId: null,

  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setInspectNode: (inspectNodeId) => set({ inspectNodeId }),
}));