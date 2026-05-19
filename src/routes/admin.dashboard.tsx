import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  ),
});

function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Foundation ready. Stats coming next.</p>
      <Button
        variant="outline"
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: "/admin/login" });
        }}
      >
        Sign out
      </Button>
    </AdminShell>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const links = [
    ["/admin/dashboard", "Dashboard"],
    ["/admin/guests", "Guests"],
    ["/admin/rsvp", "RSVP"],
    ["/admin/guestbook", "Guestbook"],
    ["/admin/settings", "Settings"],
  ] as const;
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-muted/30 p-4 space-y-1">
        <div className="font-semibold mb-4">Admin Panel</div>
        {links.map(([to, label]) => (
          <Link
            key={to}
            to={to}
            className="block px-3 py-2 rounded-md text-sm hover:bg-muted [&.active]:bg-primary [&.active]:text-primary-foreground"
            activeProps={{ className: "active" }}
          >
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
