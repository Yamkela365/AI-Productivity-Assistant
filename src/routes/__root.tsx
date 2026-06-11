import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../lib/theme";
import { AppShell } from "../components/layout/AppShell";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TaskFlow AI — Smart Task Management Platform" },
      {
        name: "description",
        content:
          "TaskFlow AI is an AI-powered task management platform with smart calendars, reports, audits, appointments and a built-in assistant.",
      },
      { name: "author", content: "TaskFlow AI" },
      { property: "og:title", content: "TaskFlow AI — Smart Task Management Platform" },
      {
        property: "og:description",
        content: "Manage tasks, calendars, audits and appointments with a built-in AI assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "TaskFlow AI — Smart Task Management Platform" },
      { name: "description", content: "TaskFlow AI is a smart, AI-powered platform for managing tasks, appointments, and audits." },
      { property: "og:description", content: "TaskFlow AI is a smart, AI-powered platform for managing tasks, appointments, and audits." },
      { name: "twitter:description", content: "TaskFlow AI is a smart, AI-powered platform for managing tasks, appointments, and audits." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/24cdb9c7-f42f-41e1-bd57-daf45a5708f6/id-preview-5597f449--84d8d0bd-7ae9-478b-bacf-099fe9318feb.lovable.app-1781097219381.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/24cdb9c7-f42f-41e1-bd57-daf45a5708f6/id-preview-5597f449--84d8d0bd-7ae9-478b-bacf-099fe9318feb.lovable.app-1781097219381.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname === "/login" || pathname === "/register";
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && !bare) {
      navigate({ to: "/login" });
    }
  }, [loading, user, bare, navigate]);

  if (bare) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <AuthGate>
            <Outlet />
          </AuthGate>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
