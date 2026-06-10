import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  ShieldCheck,
  Flame,
  CalendarClock,
  Mail,
  Bot,
  Settings,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/audits", label: "Audits", icon: ShieldCheck },
  { to: "/priorities", label: "Priorities", icon: Flame },
  { to: "/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/emails", label: "Emails", icon: Mail },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
              <Zap className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-sidebar-foreground">TaskFlow</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">AI</p>
            </div>
          </Link>
          <button onClick={onClose} className="rounded-md p-1 text-sidebar-foreground lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px]", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl gradient-primary p-4 text-primary-foreground shadow-card">
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-xs opacity-90">Unlock unlimited AI actions & integrations.</p>
          <button className="mt-3 w-full rounded-lg bg-primary-foreground/15 py-1.5 text-xs font-semibold backdrop-blur hover:bg-primary-foreground/25">
            Learn more
          </button>
        </div>
      </aside>
    </>
  );
}
