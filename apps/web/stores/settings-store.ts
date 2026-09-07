import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface SettingsState {
  theme: Theme;
  locale: "fr";
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      locale: "fr",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "flowmind-settings" }
  )
);