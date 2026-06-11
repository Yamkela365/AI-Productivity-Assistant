import { Menu, Search, Bell, Moon, Sun } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { currentUser } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = (user?.user_metadata?.full_name as string) || user?.email || currentUser.name;
  const displayEmail = user?.email || currentUser.email;
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 hover:bg-muted lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search tasks, audits, emails…"
          className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:bg-card"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button onClick={toggle} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              "Task “Submit monthly report” due tomorrow",
              "Appointment “Product strategy sync” in 30 min",
              "GDPR Audit deadline approaching",
              "3 unread important emails",
            ].map((n) => (
              <DropdownMenuItem key={n} className="cursor-pointer whitespace-normal py-2.5 text-sm">
                {n}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-muted">
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-primary-foreground"
                style={{ backgroundColor: currentUser.avatarColor }}
              >
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight">{displayName}</span>
                <span className="block text-[11px] leading-tight text-muted-foreground">{currentUser.role}</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>{displayEmail}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
