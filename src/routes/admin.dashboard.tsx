import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { StatCard } from "@/components/admin/StatCard";
import { useWeddingSetting } from "@/hooks/useWeddingSetting";
import { getSupabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => (
    <AdminAuthGuard>
      <AdminLayout activePage="dashboard">
        <AdminDashboard />
      </AdminLayout>
    </AdminAuthGuard>
  ),
});

type Attendance = "hadir" | "tidak_hadir" | "mungkin";

const ATT_STYLE: Record<Attendance, { bg: string; color: string; label: string }> = {
  hadir: { bg: "#dcfce7", color: "#166534", label: "Hadir" },
  tidak_hadir: { bg: "#fee2e2", color: "#991b1b", label: "Tidak Hadir" },
  mungkin: { bg: "#fef9c3", color: "#854d0e", label: "Mungkin" },
};

function fmtDateID(d: string) {
  try {
    return new Date(d).toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch { return d; }
}

function AdminDashboard() {
  const setting = useWeddingSetting();
  const stats = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const supabase = await getSupabase();
      const [g, gOpened, rH, rT, rM, rPax, gb, recentR, recentMsg] = await Promise.all([
        supabase.from("guests").select("*", { count: "exact", head: true }),
        supabase.from("guests").select("*", { count: "exact", head: true }).not("opened_at", "is", null),
        supabase.from("rsvps").select("*", { count: "exact", head: true }).eq("attendance", "hadir"),
        supabase.from("rsvps").select("*", { count: "exact", head: true }).eq("attendance", "tidak_hadir"),
        supabase.from("rsvps").select("*", { count: "exact", head: true }).eq("attendance", "mungkin"),
        supabase.from("rsvps").select("total_guests").eq("attendance", "hadir"),
        supabase.from("guestbook_messages").select("*", { count: "exact", head: true }),
        supabase.from("rsvps").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("guestbook_messages").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      const totalPax = (rPax.data ?? []).reduce((sum, r) => sum + (r.total_guests ?? 0), 0);
      return {
        total_guests: g.count ?? 0,
        opened: gOpened.count ?? 0,
        rsvp_hadir: rH.count ?? 0,
        rsvp_tidak: rT.count ?? 0,
        rsvp_mungkin: rM.count ?? 0,
        total_pax: totalPax,
        guestbook_count: gb.count ?? 0,
        recent_rsvps: recentR.data ?? [],
        recent_messages: recentMsg.data ?? [],
      };
    },
  });

  const s = stats.data;
  const pct = s && s.total_guests > 0 ? Math.round((s.opened / s.total_guests) * 100) : 0;
  const akad = setting.data?.akad_datetime;
  const daysLeft = akad
    ? Math.ceil((new Date(akad).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle={
          setting.data
            ? `${setting.data.bride_name ?? ""} & ${setting.data.groom_name ?? ""} Wedding`
            : undefined
        }
        action={
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#C9A96E", color: "#fff", padding: "0.6rem 1rem",
              borderRadius: 8, fontSize: "0.85rem", textDecoration: "none",
            }}
          >
            🔗 Preview Undangan
          </a>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <StatCard label="Total Tamu" value={s?.total_guests ?? 0} />
        <StatCard label="Sudah Buka" value={s?.opened ?? 0} sub={`${pct}% dari total`} />
        <StatCard label="Konfirmasi Hadir" value={s?.rsvp_hadir ?? 0} sub={`${s?.total_pax ?? 0} pax total`} valueColor="#166534" />
        <StatCard label="Tidak Hadir" value={s?.rsvp_tidak ?? 0} valueColor="#991b1b" />
        <StatCard label="Mungkin Hadir" value={s?.rsvp_mungkin ?? 0} valueColor="#854d0e" />
        <StatCard label="Ucapan" value={s?.guestbook_count ?? 0} />
      </div>

      {akad && daysLeft !== null && (
        <div
          style={{
            background:
              daysLeft > 0
                ? "linear-gradient(135deg, #1a1a1a, #2d2d2d)"
                : "linear-gradient(135deg, #166534, #15803d)",
            color: "#fff",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {daysLeft > 0 ? (
            <>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Hitung Mundur
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "1rem" }}>{fmtDateID(akad)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "3rem", fontWeight: 700, color: "#C9A96E", lineHeight: 1 }}>
                  {daysLeft}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>hari lagi</div>
              </div>
            </>
          ) : (
            <div style={{ fontSize: "1.1rem", fontWeight: 500 }}>
              🎉 Selamat! Hari bahagia telah tiba!
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="dash-grid">
        <style>{`@media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
        <AdminCard title="RSVP Terbaru">
          <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "0.72rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.5rem 0" }}>Nama</th>
                <th>Kehadiran</th>
                <th>Pax</th>
              </tr>
            </thead>
            <tbody>
              {(s?.recent_rsvps ?? []).map((r) => {
                const a = ATT_STYLE[r.attendance as Attendance];
                return (
                  <tr key={r.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.6rem 0" }}>{r.name}</td>
                    <td>
                      <span style={{ background: a.bg, color: a.color, padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.72rem" }}>
                        {a.label}
                      </span>
                    </td>
                    <td>{r.total_guests}</td>
                  </tr>
                );
              })}
              {!s?.recent_rsvps?.length && (
                <tr><td colSpan={3} style={{ padding: "1rem 0", color: "#6b7280" }}>Belum ada RSVP</td></tr>
              )}
            </tbody>
          </table>
          <a href="/admin/rsvp" style={{ color: "#C9A96E", fontSize: "0.78rem", marginTop: "0.75rem", display: "inline-block" }}>
            Lihat semua →
          </a>
        </AdminCard>

        <AdminCard title="Ucapan Terbaru">
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {(s?.recent_messages ?? []).map((m) => (
              <div key={m.id} style={{ background: "#f9fafb", borderRadius: 8, padding: "0.75rem", borderLeft: "3px solid #C9A96E" }}>
                <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>{m.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {m.message.length > 80 ? `${m.message.slice(0, 80)}…` : m.message}
                </div>
              </div>
            ))}
            {!s?.recent_messages?.length && (
              <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Belum ada ucapan</div>
            )}
          </div>
          <a href="/admin/guestbook" style={{ color: "#C9A96E", fontSize: "0.78rem", marginTop: "0.75rem", display: "inline-block" }}>
            Lihat semua →
          </a>
        </AdminCard>
      </div>
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <AdminLayout activePage="">{children}</AdminLayout>;
}
