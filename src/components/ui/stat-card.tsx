import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  delta,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "destructive" | "info" | "accent";
  delta?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-info/15 text-info",
    accent: "bg-accent/15 text-accent",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className={cn("grid h-11 w-11 place-items-center rounded-xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        {delta && <span className="text-xs font-semibold text-muted-foreground">{delta}</span>}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
