export type Priority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "in-progress" | "completed" | "overdue";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // ISO
  category: string;
  assignee: string;
  attachments: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "User";
  avatarColor: string;
}

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";
export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  location: string;
  notes: string;
  attendees: string[];
  meetingLink?: string;
  status: AppointmentStatus;
}

export type AuditStatus = "open" | "in-review" | "closed";
export interface Audit {
  id: string;
  name: string;
  date: string;
  department: string;
  auditor: string;
  findings: number;
  risk: Priority;
  status: AuditStatus;
  compliance: number;
}

export type EmailBox = "inbox" | "sent" | "drafts" | "archived";
export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  date: string;
  box: EmailBox;
  unread: boolean;
  flagged: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date yyyy-mm-dd
  type: "meeting" | "deadline" | "appointment" | "audit";
  priority: Priority;
}

const today = new Date();
const iso = (offsetDays: number, h = 9, m = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const day = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const users: AppUser[] = [
  { id: "u1", name: "YamkelaM", email: "yamkela@taskflow.ai", role: "Admin", avatarColor: "#2563eb" },
  { id: "u2", name: "Priya Sharma", email: "priya@taskflow.ai", role: "Manager", avatarColor: "#14b8a6" },
  { id: "u3", name: "Diego Lopez", email: "diego@taskflow.ai", role: "User", avatarColor: "#f59e0b" },
  { id: "u4", name: "Mia Chen", email: "mia@taskflow.ai", role: "User", avatarColor: "#8b5cf6" },
];

export const currentUser = users[0];

const categories = ["Marketing", "Engineering", "Finance", "Operations", "Design", "Sales"];

export const tasks: Task[] = [
  { id: "t1", title: "Submit monthly financial report", description: "Compile Q figures and submit to finance leadership.", priority: "critical", status: "in-progress", dueDate: iso(1, 17), category: "Finance", assignee: "YamkelaM", attachments: 2 },
  { id: "t2", title: "Design new onboarding flow", description: "Wireframes and prototype for the new signup experience.", priority: "high", status: "in-progress", dueDate: iso(3, 12), category: "Design", assignee: "Mia Chen", attachments: 4 },
  { id: "t3", title: "Fix checkout bug on mobile", description: "Investigate payment failure on iOS Safari.", priority: "critical", status: "pending", dueDate: iso(0, 15), category: "Engineering", assignee: "Diego Lopez", attachments: 1 },
  { id: "t4", title: "Prepare Q3 marketing campaign", description: "Plan channels, budget and creative direction.", priority: "medium", status: "pending", dueDate: iso(6, 10), category: "Marketing", assignee: "Priya Sharma", attachments: 0 },
  { id: "t5", title: "Review vendor contracts", description: "Legal review of three new supplier agreements.", priority: "high", status: "overdue", dueDate: iso(-2, 9), category: "Operations", assignee: "YamkelaM", attachments: 3 },
  { id: "t6", title: "Update brand guidelines", description: "Refresh logo usage and color palette docs.", priority: "low", status: "completed", dueDate: iso(-4, 14), category: "Design", assignee: "Mia Chen", attachments: 1 },
  { id: "t7", title: "Onboard new sales hires", description: "Set up accounts and training schedule.", priority: "medium", status: "in-progress", dueDate: iso(4, 11), category: "Sales", assignee: "Priya Sharma", attachments: 0 },
  { id: "t8", title: "Database performance tuning", description: "Optimize slow queries on the analytics service.", priority: "high", status: "pending", dueDate: iso(2, 16), category: "Engineering", assignee: "Diego Lopez", attachments: 2 },
  { id: "t9", title: "Quarterly compliance check", description: "Verify GDPR data handling processes.", priority: "critical", status: "overdue", dueDate: iso(-1, 9), category: "Operations", assignee: "YamkelaM", attachments: 5 },
  { id: "t10", title: "Write release notes v2.4", description: "Summarize new features for the changelog.", priority: "low", status: "completed", dueDate: iso(-3, 13), category: "Engineering", assignee: "Diego Lopez", attachments: 0 },
  { id: "t11", title: "Customer feedback synthesis", description: "Cluster survey responses into themes.", priority: "medium", status: "pending", dueDate: iso(5, 10), category: "Marketing", assignee: "Mia Chen", attachments: 1 },
  { id: "t12", title: "Renew cloud subscriptions", description: "Confirm budget and renew annual plans.", priority: "high", status: "in-progress", dueDate: iso(8, 9), category: "Finance", assignee: "Priya Sharma", attachments: 0 },
];

export const appointments: Appointment[] = [
  { id: "a1", title: "Product strategy sync", date: day(0), time: "10:00", location: "Zoom", notes: "Discuss roadmap for next quarter.", attendees: ["YamkelaM", "Priya Sharma"], meetingLink: "https://zoom.us/j/123", status: "upcoming" },
  { id: "a2", title: "Client onboarding call", date: day(1), time: "14:00", location: "Google Meet", notes: "Walk through platform setup with Acme Co.", attendees: ["Diego Lopez", "Mia Chen"], meetingLink: "https://meet.google.com/abc", status: "upcoming" },
  { id: "a3", title: "Field audit — Warehouse B", date: day(2), time: "09:30", location: "Site B, Rotterdam", notes: "On-site safety compliance audit.", attendees: ["YamkelaM"], status: "upcoming" },
  { id: "a4", title: "Design review", date: day(-1), time: "11:00", location: "Figma", notes: "Reviewed onboarding mockups.", attendees: ["Mia Chen", "Priya Sharma"], status: "completed" },
  { id: "a5", title: "Budget planning", date: day(-3), time: "15:00", location: "Conference Room A", notes: "Cancelled — rescheduled to next week.", attendees: ["YamkelaM", "Priya Sharma"], status: "cancelled" },
  { id: "a6", title: "Weekly standup", date: day(3), time: "09:00", location: "Microsoft Teams", notes: "Team progress check-in.", attendees: ["YamkelaM", "Diego Lopez", "Mia Chen"], meetingLink: "https://teams.microsoft.com/l/x", status: "upcoming" },
];

export const audits: Audit[] = [
  { id: "au1", name: "Annual Security Audit", date: day(-5), department: "IT", auditor: "YamkelaM", findings: 7, risk: "high", status: "in-review", compliance: 82 },
  { id: "au2", name: "Financial Controls Review", date: day(-12), department: "Finance", auditor: "Priya Sharma", findings: 3, risk: "medium", status: "closed", compliance: 95 },
  { id: "au3", name: "Warehouse Safety Inspection", date: day(2), department: "Operations", auditor: "YamkelaM", findings: 0, risk: "low", status: "open", compliance: 100 },
  { id: "au4", name: "GDPR Compliance Audit", date: day(-2), department: "Legal", auditor: "Priya Sharma", findings: 12, risk: "critical", status: "open", compliance: 64 },
  { id: "au5", name: "Vendor Risk Assessment", date: day(-20), department: "Procurement", auditor: "Diego Lopez", findings: 5, risk: "medium", status: "closed", compliance: 88 },
];

export const emails: Email[] = [
  { id: "e1", from: "Acme Corp", fromEmail: "ops@acme.com", subject: "Contract renewal — action needed by Friday", preview: "Hi Alex, please review the attached renewal terms and confirm before the deadline this Friday.", date: iso(0, 8, 12), box: "inbox", unread: true, flagged: true },
  { id: "e2", from: "Priya Sharma", fromEmail: "priya@taskflow.ai", subject: "Q3 campaign draft for review", preview: "Sharing the first draft of the campaign plan. Can we sync tomorrow to finalize?", date: iso(0, 7, 40), box: "inbox", unread: true, flagged: false },
  { id: "e3", from: "GitHub", fromEmail: "noreply@github.com", subject: "Security alert in repository", preview: "A new vulnerability was detected in one of your dependencies.", date: iso(-1, 22, 5), box: "inbox", unread: true, flagged: false },
  { id: "e4", from: "Finance Team", fromEmail: "finance@taskflow.ai", subject: "Reminder: submit expenses", preview: "Monthly expense reports are due end of week. Please follow up.", date: iso(-1, 16, 0), box: "inbox", unread: false, flagged: false },
  { id: "e5", from: "Alex Morgan", fromEmail: "alex@taskflow.ai", subject: "Re: Roadmap priorities", preview: "Agreed on the priorities. Let's lock the deadline for the launch.", date: iso(-2, 10, 0), box: "sent", unread: false, flagged: false },
  { id: "e6", from: "Alex Morgan", fromEmail: "alex@taskflow.ai", subject: "Draft: Partnership proposal", preview: "Outline for the partnership pitch — still need numbers.", date: iso(-1, 18, 0), box: "drafts", unread: false, flagged: false },
  { id: "e7", from: "Newsletter", fromEmail: "hello@producthunt.com", subject: "This week in tech", preview: "Top launches and trends you might have missed.", date: iso(-6, 9, 0), box: "archived", unread: false, flagged: false },
];

export const calendarEvents: CalendarEvent[] = [
  ...tasks.map((t) => ({ id: `cal-${t.id}`, title: t.title, date: t.dueDate.slice(0, 10), type: "deadline" as const, priority: t.priority })),
  ...appointments.map((a) => ({ id: `cal-${a.id}`, title: a.title, date: a.date, type: (a.title.toLowerCase().includes("audit") ? "audit" : "appointment") as "audit" | "appointment", priority: "medium" as const })),
  { id: "cal-m1", title: "All-hands meeting", date: day(2), type: "meeting", priority: "medium" },
  { id: "cal-m2", title: "Sprint planning", date: day(7), type: "meeting", priority: "high" },
];

// Reports / chart data
export const productivityData = [
  { name: "Mon", completed: 8, created: 11 },
  { name: "Tue", completed: 12, created: 9 },
  { name: "Wed", completed: 6, created: 14 },
  { name: "Thu", completed: 15, created: 10 },
  { name: "Fri", completed: 11, created: 7 },
  { name: "Sat", completed: 4, created: 3 },
  { name: "Sun", completed: 2, created: 2 },
];

export const completionTrend = [
  { name: "Wk 1", rate: 64 },
  { name: "Wk 2", rate: 71 },
  { name: "Wk 3", rate: 68 },
  { name: "Wk 4", rate: 79 },
  { name: "Wk 5", rate: 84 },
  { name: "Wk 6", rate: 88 },
];

export const categoryDistribution = categories.map((c) => ({
  name: c,
  value: tasks.filter((t) => t.category === c).length,
}));

export const teamPerformance = users.map((u) => ({
  name: u.name.split(" ")[0],
  completed: tasks.filter((t) => t.assignee === u.name && t.status === "completed").length + Math.floor(Math.random() * 8) + 4,
  pending: tasks.filter((t) => t.assignee === u.name && t.status !== "completed").length,
}));

// Weather
export const weather = {
  city: "Amsterdam",
  temp: 18,
  condition: "Partly Cloudy",
  humidity: 62,
  wind: 14,
  forecast: [
    { day: "Mon", hi: 19, lo: 11, icon: "cloud" },
    { day: "Tue", hi: 21, lo: 12, icon: "sun" },
    { day: "Wed", hi: 17, lo: 10, icon: "rain" },
    { day: "Thu", hi: 16, lo: 9, icon: "rain" },
    { day: "Fri", hi: 20, lo: 11, icon: "sun" },
    { day: "Sat", hi: 22, lo: 13, icon: "sun" },
    { day: "Sun", hi: 18, lo: 10, icon: "cloud" },
  ] as { day: string; hi: number; lo: number; icon: "sun" | "cloud" | "rain" }[],
};

// Derived dashboard stats
export const stats = {
  total: tasks.length,
  completed: tasks.filter((t) => t.status === "completed").length,
  pending: tasks.filter((t) => t.status === "pending" || t.status === "in-progress").length,
  overdue: tasks.filter((t) => t.status === "overdue").length,
  upcomingAppointments: appointments.filter((a) => a.status === "upcoming").length,
  unreadEmails: emails.filter((e) => e.unread).length,
};

export const priorityMeta: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: "text-destructive", bg: "bg-destructive/10 text-destructive" },
  high: { label: "High", color: "text-warning", bg: "bg-warning/15 text-warning" },
  medium: { label: "Medium", color: "text-info", bg: "bg-info/15 text-info" },
  low: { label: "Low", color: "text-success", bg: "bg-success/15 text-success" },
};

export const statusMeta: Record<TaskStatus, { label: string; bg: string }> = {
  pending: { label: "Pending", bg: "bg-muted text-muted-foreground" },
  "in-progress": { label: "In Progress", bg: "bg-info/15 text-info" },
  completed: { label: "Completed", bg: "bg-success/15 text-success" },
  overdue: { label: "Overdue", bg: "bg-destructive/10 text-destructive" },
};
