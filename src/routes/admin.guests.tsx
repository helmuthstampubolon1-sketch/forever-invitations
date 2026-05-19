import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminShell } from "./admin.dashboard";

export const Route = createFileRoute("/admin/guests")({
  component: () => (
    <AdminAuthGuard>
      <AdminShell>
        <h1 className="text-2xl font-bold mb-4">Guests</h1>
        <p className="text-muted-foreground">Guest manager — coming next.</p>
      </AdminShell>
    </AdminAuthGuard>
  ),
});
