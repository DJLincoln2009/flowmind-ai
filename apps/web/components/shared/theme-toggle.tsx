"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Bascule sombre/clair. Les deux icônes sont toujours rendues (aucun état React)
 * et basculées en pur CSS via la classe `.dark` — aucun risque d'hydration mismatch.
 */
export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  const onClick = () => {
    const isDark = resolvedTheme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title="Changer de thème"
      aria-label="Changer de thème"
      className="flex w-full items-center justify-center rounded-lg border border-border bg-surface-raised py-2 text-text-secondary transition-colors hover:text-text-primary"
    >
      <Sun size={15} className="hidden dark:block" />
      <Moon size={15} className="block dark:hidden" />
      {!collapsed && <span className="sr-only">Changer de thème</span>}
    </button>
  );
}