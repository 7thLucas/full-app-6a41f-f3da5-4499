import { Link, useLocation } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  KanbanSquare,
  BarChart3,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const { config, loading } = useConfigurables();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const appName = config.appName ?? "RecruitIQ";
  const tagline = config.appTagline ?? "Screen smarter. Hire faster.";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar-background border-r border-sidebar-border transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-sidebar-border">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt={appName} className="w-8 h-8 object-contain rounded" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-foreground" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sidebar-foreground text-sm">{appName}</p>
            <p className="text-xs text-sidebar-accent-foreground opacity-70">{tagline}</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = location.pathname === href || location.pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-accent-foreground opacity-50">
            {config.footerText ?? `${appName} — ${tagline}`}
          </p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 sm:px-6 h-14 bg-navbar-background border-b border-border shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-primary-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          {title && (
            <h1 className="text-base font-semibold text-primary-foreground truncate">{title}</h1>
          )}
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 bg-primary/80 rounded-full px-3 py-1">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <span className="text-xs font-bold text-accent-foreground">R</span>
              </div>
              <span className="text-xs text-primary-foreground font-medium hidden sm:block">
                {config.orgName ?? "RecruitIQ"}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
