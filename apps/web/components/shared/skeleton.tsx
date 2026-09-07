import { cn } from "cn";

/**
 * Bloc squelette de chargement (jamais de spinner seul).
 * Utiliser des variantes : "text" (ligne), "card" (carte), "circle".
 */
export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-menu/70", className)}
    />
  );
}

/** Ligne de tableau / description. */
export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn("h-3.5 w-full", className)} />;
}

/** Carte KPI en chargement. */
export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface-raised p-4">
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}

/** Ligne d'historique (table) en chargement. */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3.5 flex-1 last:w-24 last:flex-none" />
      ))}
    </div>
  );
}