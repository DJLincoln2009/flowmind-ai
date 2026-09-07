"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/shared/sidebar";
import { CommandPalette } from "@/components/shared/command-palette";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { api } from "@/lib/api-client";
import { useUiStore } from "@/stores/ui-store";

/** Replie/moi la sidebar automatiquement selon la taille d'écran. */
function useResponsiveSidebar() {
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setCollapsed(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setCollapsed]);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    api.loadTokens();
  }, []);

  useResponsiveSidebar();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <main className="min-h-0 flex-1 overflow-hidden">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
        <CommandPalette />
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </QueryClientProvider>
  );
}