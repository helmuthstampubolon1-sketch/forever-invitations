import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminShell } from "./admin.dashboard";

export const Route = createFileRoute("/admin/rsvp")({
  component: () => (
    <AdminAuthGuard>
      <AdminShell>
        <h1 className="text-2xl font-bold mb-4">RSVP</h1>
        <p className="text-muted-foreground">RSVP list — coming next.</p>
      </AdminShell>
    </AdminAuthGuard>
  ),
});
