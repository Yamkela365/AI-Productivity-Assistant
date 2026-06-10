import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarClock,
  Mail,
  Plus,
  CalendarPlus,
  ShieldCheck,
  FileBarChart,
  Bot,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/stat-card";
import { WeatherWidget } from "@/components/ui/weather-widget";
import {
  stats,
  tasks,
  appointments,
  productivityData,
  currentUser,
  priorityMeta,
  statusMeta,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TaskFlow AI" },
      { name: "description", content: "Your task, calendar and productivity overview at a glance." },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { label: "Add New Task", icon: Plus, to: "/tasks" as const, tone: "bg-primary/10 text-primary" },
  { label: "Schedule Appointment", icon: CalendarPlus, to: "/appointments" as const, tone: "bg-info/15 text-info" },
  { label: "Create Audit", icon: ShieldCheck, to: "/audits" as const, tone: "bg-accent/15 text-accent" },
  { label: "Generate Report", icon: FileBarChart, to: "/reports" as const, tone: "bg-warning/15 text-warning" },
  { label: "Open AI Assistant", icon: Bot, to: "/assistant" as const, tone: "bg-success/15 text-success" },
];

function Dashboard() {
  const recentTasks = [...tasks]
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
    .slice(0, 5);
  const upcoming = appointments.filter((a) => a.status === "upcoming").slice(0, 4);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]} 👋`}
        subtitle="Here's what's happening across your workspace today."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Tasks" value={stats.total} icon={CheckSquare} tone="primary" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="info" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="destructive" />
        <StatCard label="Appointments" value={stats.upcomingAppointments} icon={CalendarClock} tone="accent" />
        <StatCard label="Unread Emails" value={stats.unreadEmails} icon={Mail} tone="warning" />
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background/50 p-4 text-center transition-all hover:border-primary hover:shadow-card"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-lg ${a.tone}`}>
                <a.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="mb-4 font-semibold">Productivity this week</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Area type="monotone" dataKey="created" stroke="var(--accent)" fill="url(#g2)" strokeWidth={2} name="Created" />
              <Area type="monotone" dataKey="completed" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <WeatherWidget />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Upcoming Tasks</h2>
            <Link to="/tasks" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${priorityMeta[t.priority].color.replace("text-", "bg-")}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.category} · {t.assignee}
                  </p>
                </div>
                <span className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-block ${statusMeta[t.status].bg}`}>
                  {statusMeta[t.status].label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-sm font-medium text-primary hover:underline">
              All
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 py-1.5 text-primary">
                  <span className="text-sm font-bold">{a.time}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
