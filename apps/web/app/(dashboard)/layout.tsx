"use client";

import { Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/shared/sidebar";
import { CommandPalette } from "@/components/shared/command-palette";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { I18nProvider } from "@/lib/i18n";
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
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const [authed] = useState(() => Boolean(api.loadTokens()));

  useResponsiveSidebar();

  useEffect(() => {
    if (!authed) router.replace("/auth/login");
  }, [authed, router]);

  // Pas de session : on ne monte pas les pages (sinon les requêtes partent sans token → 401).
  if (!authed) return null;

  return (
    <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <main className="min-h-0 flex-1 overflow-hidden">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
        <CommandPalette />
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </I18nProvider>
    </QueryClientProvider>
  );
}