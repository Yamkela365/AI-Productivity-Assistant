import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MapPin, Video, Users, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { appointments as seed, type AppointmentStatus } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments — TaskFlow AI" }] }),
  component: AppointmentsPage,
});

const meta: Record<AppointmentStatus, { label: string; bg: string }> = {
  upcoming: { label: "Upcoming", bg: "bg-info/15 text-info" },
  completed: { label: "Completed", bg: "bg-success/15 text-success" },
  cancelled: { label: "Cancelled", bg: "bg-destructive/10 text-destructive" },
};

function AppointmentsPage() {
  const [tab, setTab] = useState<AppointmentStatus | "all">("all");
  const list = seed.filter((a) => tab === "all" || a.status === tab);

  return (
    <>
      <PageHeader
        title="Appointment Management"
        subtitle="Schedule meetings, set reminders and manage attendees."
        action={
          <Button onClick={() => toast.success("Appointment scheduled")}>
            <Plus className="mr-1 h-4 w-4" /> Schedule
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["all", "upcoming", "completed", "cancelled"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
              tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{a.title}</h3>
              <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", meta[a.status].bg)}>
                {meta[a.status].label}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.notes}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {new Date(a.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {a.time}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> {a.location}
              </p>
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-info" /> {a.attendees.join(", ")}
              </p>
            </div>
            {a.meetingLink && a.status === "upcoming" && (
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => toast.success("Opening meeting…")}>
                <Video className="mr-1.5 h-4 w-4" /> Join meeting
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
