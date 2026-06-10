import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Inbox, Send, FileEdit, Archive, Star, Search, Sparkles, ListTodo } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { emails as seed, type EmailBox } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/emails")({
  head: () => ({ meta: [{ title: "Emails — TaskFlow AI" }] }),
  component: EmailsPage,
});

const boxes: { key: EmailBox; label: string; icon: typeof Inbox }[] = [
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "sent", label: "Sent", icon: Send },
  { key: "drafts", label: "Drafts", icon: FileEdit },
  { key: "archived", label: "Archived", icon: Archive },
];

function EmailsPage() {
  const [box, setBox] = useState<EmailBox>("inbox");
  const [query, setQuery] = useState("");
  const list = seed.filter(
    (e) => e.box === box && (!query || e.subject.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <PageHeader title="Email Center" subtitle="Smart inbox with AI action items and task linking." />

      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        <div className="space-y-1.5">
          {boxes.map((b) => {
            const count = seed.filter((e) => e.box === b.key && e.unread).length;
            return (
              <button
                key={b.key}
                onClick={() => setBox(b.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  box === b.key ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <b.icon className="h-4 w-4" /> {b.label}
                {count > 0 && (
                  <span className={cn("ml-auto rounded-full px-1.5 text-xs", box === b.key ? "bg-primary-foreground/20" : "bg-primary text-primary-foreground")}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> AI Suggestions
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <li>2 emails contain action items</li>
              <li>1 deadline detected this week</li>
              <li>3 follow-ups recommended</li>
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search emails…" className="pl-9" />
            </div>
          </div>
          {list.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No emails here.</p>}
          {list.map((e) => (
            <div
              key={e.id}
              className={cn(
                "flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/40",
                e.unread && "bg-primary/5",
              )}
            >
              <Star className={cn("h-4 w-4 shrink-0", e.flagged ? "fill-warning text-warning" : "text-muted-foreground")} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("truncate text-sm", e.unread ? "font-bold" : "font-medium")}>{e.from}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className={cn("truncate text-sm", e.unread ? "font-semibold" : "text-muted-foreground")}>{e.subject}</p>
                <p className="truncate text-xs text-muted-foreground">{e.preview}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast.success("Task created from email")}>
                <ListTodo className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
