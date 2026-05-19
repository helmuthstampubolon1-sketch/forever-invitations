import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminShell } from "./admin.dashboard";

export const Route = createFileRoute("/admin/guestbook")({
  component: () => (
    <AdminAuthGuard>
      <AdminShell>
        <h1 className="text-2xl font-bold mb-4">Guestbook</h1>
        <p className="text-muted-foreground">Moderation — coming next.</p>
      </AdminShell>
    </AdminAuthGuard>
  ),
});
