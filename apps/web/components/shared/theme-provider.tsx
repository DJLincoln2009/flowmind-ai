"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Fournit le thème via next-themes avec l'attribut `class` basculé sur `<html>`
 * (compatible globals.css : `.dark` connu, mode clair = `html:not(.dark)`).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}