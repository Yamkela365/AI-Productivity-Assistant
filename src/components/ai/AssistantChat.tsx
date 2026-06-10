import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function partsToText(message: UIMessage) {
  return message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function renderMarkdown(text: string) {
  // lightweight markdown: bold, bullets, line breaks
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);
    const content = (bulletMatch ? bulletMatch[1] : line)
      .split(/(\*\*[^*]+\*\*)/g)
      .map((seg, j) =>
        seg.startsWith("**") && seg.endsWith("**") ? (
          <strong key={j}>{seg.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{seg}</span>
        ),
      );
    if (bulletMatch) {
      return (
        <div key={i} className="flex gap-1.5">
          <span className="text-primary">•</span>
          <span>{content}</span>
        </div>
      );
    }
    return (
      <p key={i} className={line.trim() === "" ? "h-2" : ""}>
        {content}
      </p>
    );
  });
}

const SUGGESTIONS = [
  "Show my high priority tasks",
  "Summarize the GDPR compliance audit",
  "Generate a productivity report for this week",
  "Schedule a meeting on Friday at 2 PM",
];

export function AssistantChat({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "The assistant ran into an error."),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const submit = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-card">
              <Bot className="h-6 w-6" />
            </span>
            <p className="mt-3 font-semibold">How can I help you today?</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Ask me to create tasks, schedule meetings, generate reports or prioritize your work.
            </p>
            <div className={cn("mt-4 grid w-full gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
              <span
                className={cn(
                  "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  isUser ? "bg-primary text-primary-foreground" : "gradient-primary text-primary-foreground",
                )}
              >
                {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div
                className={cn(
                  "max-w-[80%] space-y-1 rounded-2xl px-3.5 py-2.5 text-sm",
                  isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
              >
                {renderMarkdown(partsToText(m))}
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="flex gap-2.5">
            <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full gradient-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </span>
            <div className="rounded-2xl bg-muted px-3.5 py-3">
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask TaskFlow AI…"
          className="h-10 flex-1 rounded-lg border border-input bg-muted/50 px-3 text-sm outline-none focus:border-ring focus:bg-card"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
