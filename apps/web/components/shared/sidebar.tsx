"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  LayoutDashboard,
  Workflow,
  Settings as SettingsIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { useUiStore } from "@/stores/ui-store";

const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    label: "Historique",
    href: "/history",
    icon: History,
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: SettingsIcon,
  },
];

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={[
        "group flex items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-[13.5px] font-medium",
        "transition-all duration-150",
        active
          ? "border-accent/30 bg-accent/10 text-text-primary"
          : "text-text-secondary hover:bg-surface-raised hover:text-text-primary",
      ].join(" ")}
    >
      <Icon
        size={16}
        className="shrink-0 text-text-secondary transition-colors group-hover:text-text-primary"
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && !active && null}
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
      )}
    </Link>
  );
}

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={[
        "flex shrink-0 flex-col border-r border-border bg-surface-base transition-[width] duration-200",
        collapsed ? "w-14" : "w-56",
      ].join(" ")}
    >
      {/* Brand */}
      <div
        className={[
          "flex items-center gap-2.5 px-4 py-4",
          collapsed && "justify-center px-2",
        ].join(" ")}
      >
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-white">
          <Sparkles size={15} strokeWidth={2} />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-semibold tracking-tight text-text-primary">
            FlowMind
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2.5">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className={["flex px-2.5 pb-3", collapsed && "px-2"].join(" ")}>
        <button
          onClick={toggleSidebar}
          title={collapsed ? "Étendre la barre latérale" : "Réduire la barre latérale"}
          className="flex w-full items-center justify-center rounded-lg border border-border bg-surface-raised py-2 text-text-secondary transition-colors hover:text-text-primary"
        >
          {collapsed ? (
            <PanelLeftOpen size={15} />
          ) : (
            <PanelLeftClose size={15} />
          )}
        </button>
      </div>
    </aside>
  );
}