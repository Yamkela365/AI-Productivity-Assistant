import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  List,
  LayoutGrid,
  CalendarDays,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  Archive,
  Paperclip,
} from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  tasks as seed,
  priorityMeta,
  statusMeta,
  users,
  type Task,
  type Priority,
  type TaskStatus,
} from "@/lib/mock-data";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — TaskFlow AI" }] }),
  component: TasksPage,
});

type Filter = "all" | "today" | "week" | "month" | "high" | "completed" | "overdue";
const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "high", label: "High Priority" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

const categories = ["Marketing", "Engineering", "Finance", "Operations", "Design", "Sales"];
const boardCols: { key: TaskStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

function emptyTask(): Task {
  return {
    id: "",
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: new Date().toISOString(),
    category: "Engineering",
    assignee: users[0].name,
    attachments: 0,
  };
}

function TasksPage() {
  const [list, setList] = useState<Task[]>(seed);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    const inDays = (iso: string, days: number) => {
      const d = new Date(iso);
      const diff = (d.getTime() - now.getTime()) / 86400000;
      return diff >= -1 && diff <= days;
    };
    return list.filter((t) => {
      if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
      switch (filter) {
        case "today":
          return new Date(t.dueDate).toDateString() === now.toDateString();
        case "week":
          return inDays(t.dueDate, 7);
        case "month":
          return inDays(t.dueDate, 31);
        case "high":
          return t.priority === "high" || t.priority === "critical";
        case "completed":
          return t.status === "completed";
        case "overdue":
          return t.status === "overdue";
        default:
          return true;
      }
    });
  }, [list, filter, query]);

  const openNew = () => {
    setEditing(emptyTask());
    setOpen(true);
  };
  const openEdit = (t: Task) => {
    setEditing(t);
    setOpen(true);
  };
  const save = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Please enter a task title.");
      return;
    }
    if (editing.id) {
      setList((l) => l.map((t) => (t.id === editing.id ? editing : t)));
      toast.success("Task updated");
    } else {
      setList((l) => [{ ...editing, id: `t${Date.now()}` }, ...l]);
      toast.success("Task created");
    }
    setOpen(false);
  };
  const remove = (id: string) => {
    setList((l) => l.filter((t) => t.id !== id));
    toast.success("Task deleted");
  };
  const setStatus = (id: string, status: TaskStatus) => {
    setList((l) => l.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success(`Marked ${statusMeta[status].label.toLowerCase()}`);
  };

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="Create, organize and track your team's work."
        action={
          <Button onClick={openNew}>
            <Plus className="mr-1 h-4 w-4" /> New Task
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="w-56 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">
            <List className="mr-1.5 h-4 w-4" /> List
          </TabsTrigger>
          <TabsTrigger value="board">
            <LayoutGrid className="mr-1.5 h-4 w-4" /> Board
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="mr-1.5 h-4 w-4" /> Calendar
          </TabsTrigger>
        </TabsList>

        {/* LIST */}
        <TabsContent value="list" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="hidden grid-cols-12 gap-2 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
              <span className="col-span-5">Task</span>
              <span className="col-span-2">Priority</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2">Due</span>
              <span className="col-span-1 text-right">·</span>
            </div>
            {filtered.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">No tasks match this filter.</p>
            )}
            {filtered.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-1 items-center gap-2 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/40 md:grid-cols-12"
              >
                <div className="col-span-5 min-w-0">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.category} · {t.assignee}
                    {t.attachments > 0 && (
                      <span className="ml-1 inline-flex items-center gap-0.5">
                        <Paperclip className="inline h-3 w-3" />
                        {t.attachments}
                      </span>
                    )}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", priorityMeta[t.priority].bg)}>
                    {priorityMeta[t.priority].label}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusMeta[t.status].bg)}>
                    {statusMeta[t.status].label}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
                <div className="col-span-1 flex justify-end">
                  <TaskMenu task={t} onEdit={openEdit} onDelete={remove} onStatus={setStatus} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* BOARD */}
        <TabsContent value="board" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {boardCols.map((col) => {
              const items = filtered.filter((t) => t.status === col.key);
              return (
                <div key={col.key} className="rounded-xl border border-border bg-muted/30 p-3">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="text-sm font-semibold">{col.label}</h3>
                    <span className="rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((t) => (
                      <div key={t.id} className="rounded-lg border border-border bg-card p-3 shadow-soft">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{t.title}</p>
                          <TaskMenu task={t} onEdit={openEdit} onDelete={remove} onStatus={setStatus} />
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", priorityMeta[t.priority].bg)}>
                            {priorityMeta[t.priority].label}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && <p className="px-1 py-4 text-center text-xs text-muted-foreground">Empty</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* CALENDAR */}
        <TabsContent value="calendar" className="mt-4">
          <TaskCalendar tasks={filtered} onSelect={openEdit} />
        </TabsContent>
      </Tabs>

      <TaskDialog open={open} setOpen={setOpen} editing={editing} setEditing={setEditing} onSave={save} />
    </>
  );
}

function TaskMenu({
  task,
  onEdit,
  onDelete,
  onStatus,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onStatus: (id: string, s: TaskStatus) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(task)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatus(task.id, "completed")}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Mark complete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatus(task.id, "in-progress")}>
          <Archive className="mr-2 h-4 w-4" /> Mark in progress
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TaskCalendar({ tasks, onSelect }: { tasks: Task[]; onSelect: (t: Task) => void }) {
  const [month, setMonth] = useState(new Date());
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const startDay = first.getDay();
  const days = new Date(year, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{month.toLocaleString(undefined, { month: "long", year: "numeric" })}</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => setMonth(new Date(year, m - 1, 1))}>
            ‹
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMonth(new Date(year, m + 1, 1))}>
            ›
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
          const dayTasks = tasks.filter((t) => {
            const d = new Date(t.dueDate);
            return d.getFullYear() === year && d.getMonth() === m && d.getDate() === c;
          });
          const isToday = new Date().toDateString() === new Date(year, m, c).toDateString();
          return (
            <div
              key={i}
              className={cn(
                "min-h-20 rounded-lg border border-border p-1.5 text-left",
                isToday && "border-primary bg-primary/5",
              )}
            >
              <span className={cn("text-xs font-semibold", isToday && "text-primary")}>{c}</span>
              <div className="mt-1 space-y-1">
                {dayTasks.slice(0, 2).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className={cn(
                      "block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium",
                      priorityMeta[t.priority].bg,
                    )}
                  >
                    {t.title}
                  </button>
                ))}
                {dayTasks.length > 2 && (
                  <span className="px-1 text-[10px] text-muted-foreground">+{dayTasks.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskDialog({
  open,
  setOpen,
  editing,
  setEditing,
  onSave,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  editing: Task | null;
  setEditing: (t: Task) => void;
  onSave: () => void;
}) {
  if (!editing) return null;
  const up = (patch: Partial<Task>) => setEditing({ ...editing, ...patch });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing.id ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={editing.title} onChange={(e) => up({ title: e.target.value })} placeholder="Task title" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={editing.description}
              onChange={(e) => up({ description: e.target.value })}
              placeholder="Details…"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={editing.priority} onValueChange={(v) => up({ priority: v as Priority })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["low", "medium", "high", "critical"] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {priorityMeta[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={editing.status} onValueChange={(v) => up({ status: v as TaskStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["pending", "in-progress", "completed", "overdue"] as TaskStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusMeta[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={editing.category} onValueChange={(v) => up({ category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Assignee</Label>
              <Select value={editing.assignee} onValueChange={(v) => up({ assignee: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Due date</Label>
            <Input
              type="date"
              value={editing.dueDate.slice(0, 10)}
              onChange={(e) => up({ dueDate: new Date(e.target.value).toISOString() })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>{editing.id ? "Save changes" : "Create task"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
