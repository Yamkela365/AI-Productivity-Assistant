import { useState } from "react";
import { Bot, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssistantChat } from "./AssistantChat";

export function AssistantWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-pop transition-transform hover:scale-105"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-5 z-50 flex h-[min(70vh,560px)] w-[min(92vw,400px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-pop transition-all",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">TaskFlow AI</p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </p>
          </div>
        </div>
        {open && <AssistantChat compact />}
      </div>
    </>
  );
}
