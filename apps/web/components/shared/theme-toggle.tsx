"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

/** Bascule sombre/clair (pastille, position sidebar). */
export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes gère l'hydratation : avoid setState-in-effect.
  const [isDark] = useState(() => resolvedTheme === "dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
      aria-label="Basculer le thème"
      className="flex w-full items-center justify-center rounded-lg border border-border bg-surface-raised py-2 text-text-secondary transition-colors hover:text-text-primary"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
      {!collapsed && (
        <span className="sr-only">Thème {isDark ? "sombre" : "clair"}</span>
      )}
    </button>
  );
}