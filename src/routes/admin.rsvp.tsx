import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";

export const Route = createFileRoute("/admin/rsvp")({
  component: () => (
    <AdminAuthGuard>
      <AdminLayout activePage="rsvp">
        <AdminPageHeader title="RSVP" subtitle="Daftar konfirmasi kehadiran" />
        <AdminCard>
          <p style={{ color: "#6b7280" }}>RSVP list — coming next.</p>
        </AdminCard>
      </AdminLayout>
    </AdminAuthGuard>
  ),
});
