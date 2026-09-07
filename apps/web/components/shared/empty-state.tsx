import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * État vide conçu pour l'action (pas de zéro froid) : icône, titre,
 * description et éventuelles actions.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-raised text-text-secondary">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="max-w-xs text-[13px] leading-relaxed text-text-secondary">
        {description}
      </p>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}