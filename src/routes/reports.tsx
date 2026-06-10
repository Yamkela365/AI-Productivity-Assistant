import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, CheckCircle2, Users, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  productivityData,
  completionTrend,
  categoryDistribution,
  teamPerformance,
} from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — TaskFlow AI" }] }),
  component: ReportsPage,
});

const PIE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--info)"];
const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
};

function ReportsPage() {
  const exp = (fmt: string) => toast.success(`Exporting report as ${fmt}…`);
  return (
    <>
      <PageHeader
        title="Reports Center"
        subtitle="Productivity, completion, team performance and audit insights."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exp("PDF")}>
              <Download className="mr-1 h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" onClick={() => exp("Excel")}>
              Excel
            </Button>
            <Button variant="outline" onClick={() => exp("CSV")}>
              CSV
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Completion Rate" value="88%" icon={CheckCircle2} tone="success" delta="+4%" />
        <StatCard label="Avg. Tasks / Day" value="11.2" icon={TrendingUp} tone="primary" delta="+8%" />
        <StatCard label="Active Members" value="4" icon={Users} tone="accent" />
        <StatCard label="Overdue Rate" value="9%" icon={TrendingUp} tone="destructive" delta="-2%" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-semibold">Productivity Report</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
              <Legend />
              <Bar dataKey="completed" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="created" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Created" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-semibold">Task Completion Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-semibold">Tasks by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE[i % PIE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-semibold">Team Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={teamPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} width={60} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="var(--chart-1)" radius={[0, 0, 0, 0]} name="Completed" />
              <Bar dataKey="pending" stackId="a" fill="var(--chart-4)" radius={[0, 4, 4, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
