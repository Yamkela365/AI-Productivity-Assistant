import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { audits as seed, priorityMeta, type Audit, type AuditStatus } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/audits")({
  head: () => ({ meta: [{ title: "Audits — TaskFlow AI" }] }),
  component: AuditsPage,
});

const statusMeta: Record<AuditStatus, { label: string; bg: string }> = {
  open: { label: "Open", bg: "bg-info/15 text-info" },
  "in-review": { label: "In Review", bg: "bg-warning/15 text-warning" },
  closed: { label: "Closed", bg: "bg-success/15 text-success" },
};

function AuditsPage() {
  const [list] = useState<Audit[]>(seed);
  const avg = Math.round(list.reduce((s, a) => s + a.compliance, 0) / list.length);
  const totalFindings = list.reduce((s, a) => s + a.findings, 0);

  return (
    <>
      <PageHeader
        title="Audit Management"
        subtitle="Track findings, corrective actions and compliance."
        action={
          <Button onClick={() => toast.success("New audit created")}>
            <Plus className="mr-1 h-4 w-4" /> Create Audit
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Avg. Compliance</p>
          <p className="mt-1 text-3xl font-bold">{avg}%</p>
          <Progress value={avg} className="mt-3" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <ShieldCheck className="h-6 w-6 text-success" />
          <p className="mt-2 text-3xl font-bold">{list.filter((a) => a.status === "closed").length}</p>
          <p className="text-sm text-muted-foreground">Closed audits</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <p className="mt-2 text-3xl font-bold">{list.filter((a) => a.status !== "closed").length}</p>
          <p className="text-sm text-muted-foreground">Active audits</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <p className="mt-2 text-3xl font-bold">{totalFindings}</p>
          <p className="text-sm text-muted-foreground">Open findings</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="hidden grid-cols-12 gap-2 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <span className="col-span-3">Audit</span>
          <span className="col-span-2">Department</span>
          <span className="col-span-2">Auditor</span>
          <span className="col-span-1">Findings</span>
          <span className="col-span-1">Risk</span>
          <span className="col-span-2">Compliance</span>
          <span className="col-span-1">Status</span>
        </div>
        {list.map((a) => (
          <div
            key={a.id}
            className="grid grid-cols-1 items-center gap-2 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/40 md:grid-cols-12"
          >
            <div className="col-span-3 min-w-0">
              <p className="truncate font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2 text-sm">{a.department}</div>
            <div className="col-span-2 text-sm text-muted-foreground">{a.auditor}</div>
            <div className="col-span-1 text-sm font-semibold">{a.findings}</div>
            <div className="col-span-1">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", priorityMeta[a.risk].bg)}>
                {priorityMeta[a.risk].label}
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Progress value={a.compliance} className="h-2" />
              <span className="text-xs font-semibold">{a.compliance}%</span>
            </div>
            <div className="col-span-1">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", statusMeta[a.status].bg)}>
                {statusMeta[a.status].label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
