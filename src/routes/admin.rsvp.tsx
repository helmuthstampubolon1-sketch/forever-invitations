import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { getSupabase } from "@/lib/supabaseClient";
import { relativeTimeId } from "@/lib/relativeTime";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/rsvp")({
  component: () => (
    <AdminAuthGuard>
      <AdminLayout activePage="rsvp">
        <RsvpPage />
      </AdminLayout>
    </AdminAuthGuard>
  ),
});

type Attendance = "hadir" | "tidak_hadir" | "mungkin";
type Session = "akad" | "resepsi" | "keduanya";

function RsvpPage() {
  const { data: rsvps = [] } = useQuery({
    queryKey: ["admin_rsvps"],
    queryFn: async () => {
      const sb = await getSupabase();
      const { data, error } = await sb
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [att, setAtt] = useState<"all" | Attendance>("all");
  const [ses, setSes] = useState<"all" | Session>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PER = 20;

  const stats = useMemo(() => {
    const hadir = rsvps.filter((r) => r.attendance === "hadir").length;
    const tidak = rsvps.filter((r) => r.attendance === "tidak_hadir").length;
    const mungkin = rsvps.filter((r) => r.attendance === "mungkin").length;
    const pax = rsvps
      .filter((r) => r.attendance === "hadir")
      .reduce((s, r) => s + (r.total_guests || 1), 0);
    return { hadir, tidak, mungkin, pax };
  }, [rsvps]);

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      if (att !== "all" && r.attendance !== att) return false;
      if (ses !== "all" && r.session !== ses) return false;
      if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [rsvps, att, ses, q]);

  const pageRows = filtered.slice((page - 1) * PER, page * PER);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER));

  const exportCsv = () => {
    const rows = [
      ["Nama", "WA", "Kehadiran", "Sesi", "Pax", "Pesan", "Waktu"].join(","),
      ...filtered.map((r) =>
        [r.name, r.phone || "", r.attendance, r.session, r.total_guests, (r.message || "").replace(/[\n,]/g, " "), new Date(r.created_at).toISOString()]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const badge = (a: string) => {
    const map: Record<string, { bg: string; fg: string; label: string }> = {
      hadir: { bg: "#dcfce7", fg: "#166534", label: "Hadir" },
      tidak_hadir: { bg: "#fee2e2", fg: "#991b1b", label: "Tidak Hadir" },
      mungkin: { bg: "#fef9c3", fg: "#854d0e", label: "Mungkin" },
    };
    const v = map[a] ?? map.mungkin;
    return (
      <span style={{ background: v.bg, color: v.fg, padding: "2px 8px", borderRadius: 999, fontSize: 12 }}>
        {v.label}
      </span>
    );
  };

  const sessLabel = (s: string) =>
    s === "akad" ? "Akad Nikah" : s === "resepsi" ? "Resepsi" : "Akad & Resepsi";

  return (
    <>
      <AdminPageHeader
        title="RSVP"
        subtitle={`${stats.hadir} hadir · ${stats.tidak} tidak hadir · ${stats.mungkin} mungkin · ${stats.pax} pax total`}
        action={
          <button onClick={exportCsv} style={{ background: "#C9A96E", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 6, cursor: "pointer" }}>
            📥 Export CSV
          </button>
        }
      />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <StatBox label="Hadir" value={stats.hadir} bg="#dcfce7" border="#86efac" />
        <StatBox label="Tidak Hadir" value={stats.tidak} bg="#fee2e2" border="#fca5a5" />
        <StatBox label="Total Pax" value={stats.pax} bg="#fef9c3" border="#fde047" />
      </div>

      <AdminCard>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <select value={att} onChange={(e) => setAtt(e.target.value as "all" | Attendance)} className="border rounded px-2 py-1 text-sm">
            <option value="all">Semua Kehadiran</option>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
            <option value="mungkin">Mungkin</option>
          </select>
          <select value={ses} onChange={(e) => setSes(e.target.value as "all" | Session)} className="border rounded px-2 py-1 text-sm">
            <option value="all">Semua Sesi</option>
            <option value="akad">Akad</option>
            <option value="resepsi">Resepsi</option>
            <option value="keduanya">Keduanya</option>
          </select>
          <Input placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 240 }} />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                <th style={{ padding: 8 }}>Nama</th>
                <th style={{ padding: 8 }}>No. WA</th>
                <th style={{ padding: 8 }}>Kehadiran</th>
                <th style={{ padding: 8 }}>Sesi</th>
                <th style={{ padding: 8 }}>Pax</th>
                <th style={{ padding: 8 }}>Pesan</th>
                <th style={{ padding: 8 }}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 8, fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: 8 }}>
                    {r.phone ? (
                      <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={{ color: "#16a34a" }}>
                        {r.phone}
                      </a>
                    ) : "—"}
                  </td>
                  <td style={{ padding: 8 }}>{badge(r.attendance)}</td>
                  <td style={{ padding: 8 }}>{sessLabel(r.session)}</td>
                  <td style={{ padding: 8 }}>{r.total_guests}</td>
                  <td style={{ padding: 8 }} title={r.message || ""}>
                    {(r.message || "").slice(0, 40)}{(r.message || "").length > 40 ? "…" : ""}
                  </td>
                  <td style={{ padding: 8, color: "#6b7280" }}>{relativeTimeId(r.created_at)}</td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>Belum ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={btn}>‹</button>
            <span style={{ alignSelf: "center", fontSize: 13 }}>{page} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} style={btn}>›</button>
          </div>
        )}
      </AdminCard>
    </>
  );
}

const btn: React.CSSProperties = { padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: 4, background: "#fff", cursor: "pointer" };

function StatBox({ label, value, bg, border }: { label: string; value: number; bg: string; border: string }) {
  return (
    <div style={{ flex: 1, minWidth: 160, background: bg, border: `1px solid ${border}`, padding: "1rem 1.25rem", borderRadius: 8 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
