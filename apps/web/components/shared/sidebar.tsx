"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Folder,
  History,
  Languages,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Workflow,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { useUiStore } from "@/stores/ui-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

const NAV_ITEMS = [
  {
    labelKey: "nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    labelKey: "nav.workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    labelKey: "nav.templates",
    href: "/templates",
    icon: LayoutTemplate,
  },
  {
    labelKey: "nav.history",
    href: "/history",
    icon: History,
  },
];

function NavLink({
  href,
  labelKey,
  icon: Icon,
  collapsed,
}: {
  href: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  const label = t(labelKey);

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
      {!collapsed && active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
      )}
    </Link>
  );
}

function FoldersList({ collapsed }: { collapsed: boolean }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: () => api.listFolders(),
    enabled: !collapsed,
  });

  if (collapsed || folders.length === 0) return null;

  const isWorkflowsPage = pathname.startsWith("/workflows");
  const currentFolder = searchParams.get("folder");

  return (
    <div className="mt-2">
      <p className="flex items-center gap-1.5 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
        <Folder size={11} />
        {t("nav.folders")}
      </p>
      <div className="flex flex-col gap-0.5">
        {folders.slice(0, 8).map((folder) => (
          <Link
            key={folder}
            href={isWorkflowsPage ? `/workflows?folder=${encodeURIComponent(folder)}` : `/workflows?folder=${encodeURIComponent(folder)}`}
            className={[
              "truncate rounded-md px-3 py-1.5 text-[12.5px] text-text-secondary transition-colors",
              currentFolder === folder
                ? "bg-accent/10 text-text-primary"
                : "hover:bg-surface-raised hover:text-text-primary",
            ].join(" ")}
          >
            {folder}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { t, lang, setLang } = useI18n();
  const router = useRouter();
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
          <span className="overflow-hidden text-[15px] font-semibold tracking-tight text-text-primary">
            FlowMind
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2.5">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
        <FoldersList collapsed={collapsed} />
      </nav>

      {/* Footer */}
      <div className={["flex flex-col gap-1.5 px-2.5 pb-3", collapsed && "px-2"].join(" ")}>
        <ThemeToggle collapsed={collapsed} />
        <button
          onClick={() => {
            api.logout();
            router.push("/auth/login");
          }}
          title={collapsed ? t("auth.logout") : undefined}
          className={[
            "flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-raised py-2 text-text-secondary transition-colors hover:border-error/30 hover:text-error",
            collapsed ? "justify-center" : "justify-center",
          ].join(" ")}
        >
          <LogOut size={14} />
          {!collapsed && <span className="text-[12px]">{t("auth.logout")}</span>}
        </button>
        {!collapsed && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-raised px-2.5 py-1.5">
            <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
              <Languages size={12} />
              {t("common.lang.toggle")}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setLang("fr")}
                className={[
                  "rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors",
                  lang === "fr" ? "bg-accent/15 text-accent-hover" : "text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                FR
              </button>
              <button
                onClick={() => setLang("en")}
                className={[
                  "rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors",
                  lang === "en" ? "bg-accent/15 text-accent-hover" : "text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                EN
              </button>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          title={collapsed ? t("nav.expand") : t("nav.collapse")}
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