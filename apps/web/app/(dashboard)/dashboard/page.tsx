import Link from "next/link";
import { ArrowRight, Workflow } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-surface-raised p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/12 text-accent-hover">
          <Workflow size={22} />
        </div>
        <h1 className="text-lg font-semibold text-text-primary">
          Bienvenue dans FlowMind AI
        </h1>
        <p className="text-sm text-text-secondary">
          Créez votre premier workflow d&apos;automatisation : glissez des nœuds IA,
          reliez-les et lancez l&apos;exécution.
        </p>
        <Link
          href="/workflows/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Nouveau workflow
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}