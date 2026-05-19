import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminShell } from "./admin.dashboard";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <AdminAuthGuard>
      <AdminShell>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-muted-foreground">Theme & content — coming next.</p>
      </AdminShell>
    </AdminAuthGuard>
  ),
});
