import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { AssistantChat } from "@/components/ai/AssistantChat";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — TaskFlow AI" }] }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <>
      <PageHeader
        title="AI Assistant"
        subtitle="Create tasks, schedule meetings, generate reports and analyze productivity — just ask."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="flex h-[calc(100vh-220px)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <AssistantChat />
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <p className="flex items-center gap-2 font-semibold">
              <Bot className="h-5 w-5 text-primary" /> Capabilities
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {[
                "Create & prioritize tasks",
                "Schedule meetings",
                "Generate reports",
                "Summarize audits",
                "Analyze productivity",
                "Search tasks",
              ].map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
