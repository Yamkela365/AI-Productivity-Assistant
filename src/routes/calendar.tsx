import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Repeat, Bell } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calendarEvents, priorityMeta, type CalendarEvent } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — TaskFlow AI" }] }),
  component: CalendarPage,
});

const typeColor: Record<CalendarEvent["type"], string> = {
  meeting: "bg-primary/15 text-primary border-primary/30",
  deadline: "bg-destructive/10 text-destructive border-destructive/30",
  appointment: "bg-info/15 text-info border-info/30",
  audit: "bg-accent/15 text-accent border-accent/30",
};

function CalendarPage() {
  const [month, setMonth] = useState(new Date());
  const year = month.getFullYear();
  const m = month.getMonth();
  const startDay = new Date(year, m, 1).getDay();
  const days = new Date(year, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const upcoming = [...calendarEvents]
    .filter((e) => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="Smart Calendar"
        subtitle="Meetings, deadlines, appointments and audits — color-coded by priority."
        action={
          <Button onClick={() => toast.success("Sync ready for Google Calendar & Outlook")}>
            <Plus className="mr-1 h-4 w-4" /> New Event
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {month.toLocaleString(undefined, { month: "long", year: "numeric" })}
            </h3>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setMonth(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => setMonth(new Date(year, m - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setMonth(new Date(year, m + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((c, i) => {
              if (c === null) return <div key={i} />;
              const dayEvents = calendarEvents.filter((e) => {
                const d = new Date(e.date);
                return d.getFullYear() === year && d.getMonth() === m && d.getDate() === c;
              });
              const isToday = new Date().toDateString() === new Date(year, m, c).toDateString();
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-24 rounded-lg border border-border p-1.5",
                    isToday && "border-primary bg-primary/5",
                  )}
                >
                  <span className={cn("text-xs font-semibold", isToday && "text-primary")}>{c}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        className={cn("truncate rounded border px-1 py-0.5 text-[10px] font-medium", typeColor[e.type])}
                        title={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="px-1 text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4 text-xs">
            {(Object.keys(typeColor) as CalendarEvent["type"][]).map((t) => (
              <span key={t} className="flex items-center gap-1.5 capitalize">
                <span className={cn("h-3 w-3 rounded-sm border", typeColor[t])} /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 font-semibold">Upcoming</h3>
            <div className="space-y-2">
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-muted py-1">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                      {new Date(e.date).toLocaleString(undefined, { month: "short" })}
                    </span>
                    <span className="text-base font-bold">{new Date(e.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{e.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 font-semibold">Calendar features</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-primary" /> Recurring events
              </li>
              <li className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-warning" /> Reminder notifications
              </li>
              <li className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-accent" /> Drag &amp; drop scheduling
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
