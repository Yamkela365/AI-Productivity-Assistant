import { createFileRoute } from "@tanstack/react-router";
import { Flame, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { tasks, priorityMeta, statusMeta, type Priority } from "@/lib/mock-data";

export const Route = createFileRoute("/priorities")({
  head: () => ({ meta: [{ title: "Priorities — TaskFlow AI" }] }),
  component: PrioritiesPage,
});

const order: Priority[] = ["critical", "high", "medium", "low"];

function PrioritiesPage() {
  return (
    <>
      <PageHeader title="Priority Center" subtitle="Critical work, high-priority tasks and escalated issues." />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {order.map((p) => (
          <div key={p} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <span className={cn("inline-block h-3 w-3 rounded-full", priorityMeta[p].color.replace("text-", "bg-"))} />
            <p className="mt-2 text-3xl font-bold">{tasks.filter((t) => t.priority === p).length}</p>
            <p className="text-sm text-muted-foreground">{priorityMeta[p].label} priority</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {order.map((p) => {
          const items = tasks.filter((t) => t.priority === p && t.status !== "completed");
          if (items.length === 0) return null;
          return (
            <div key={p} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <Flame className={priorityMeta[p].color} />
                {priorityMeta[p].label} Priority
                <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {items.length}
                </span>
              </h2>
              <div className="space-y-2">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border-l-4 bg-muted/30 p-3",
                      p === "critical" && "border-l-destructive",
                      p === "high" && "border-l-warning",
                      p === "medium" && "border-l-info",
                      p === "low" && "border-l-success",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.category} · {t.assignee} · due{" "}
                        {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusMeta[t.status].bg)}>
                      {statusMeta[t.status].label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
