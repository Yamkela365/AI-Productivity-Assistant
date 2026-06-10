import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { currentUser, users } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — TaskFlow AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile, team and preferences." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-semibold">Profile</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input defaultValue={currentUser.name} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue={currentUser.email} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input defaultValue={currentUser.role} disabled />
            </div>
            <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 font-semibold">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggle} />
              </div>
              {["Email notifications", "Appointment reminders", "AI recommendations"].map((p, i) => (
                <div key={p} className="flex items-center justify-between">
                  <p className="text-sm font-medium">{p}</p>
                  <Switch defaultChecked={i !== 2} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 font-semibold">Team &amp; Roles</h2>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-primary-foreground"
                    style={{ backgroundColor: u.avatarColor }}
                  >
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
