import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSupabase } from "@/lib/supabaseClient";
import { relativeTimeId } from "@/lib/relativeTime";
import { showToast } from "@/hooks/useToast";

export const Route = createFileRoute("/admin/guestbook")({
  component: () => (
    <AdminAuthGuard>
      <AdminLayout activePage="guestbook">
        <Page />
      </AdminLayout>
    </AdminAuthGuard>
  ),
});

function Page() {
  const qc = useQueryClient();
  const { data: msgs = [] } = useQuery({
    queryKey: ["admin_guestbook"],
    queryFn: async () => {
      const sb = await getSupabase();
      const { data, error } = await sb
        .from("guestbook_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [filter, setFilter] = useState<"all" | "approved" | "hidden">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return msgs;
    return msgs.filter((m) => (filter === "approved" ? m.is_approved : !m.is_approved));
  }, [msgs, filter]);

  const pending = msgs.filter((m) => !m.is_approved).length;

  const toggle = async (id: string, current: boolean) => {
    const sb = await getSupabase();
    const { error } = await sb.from("guestbook_messages").update({ is_approved: !current }).eq("id", id);
    if (error) return showToast(error.message);
    qc.invalidateQueries({ queryKey: ["admin_guestbook"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus ucapan ini?")) return;
    const sb = await getSupabase();
    const { error } = await sb.from("guestbook_messages").delete().eq("id", id);
    if (error) return showToast(error.message);
    showToast("Dihapus");
    qc.invalidateQueries({ queryKey: ["admin_guestbook"] });
  };

  return (
    <>
      <AdminPageHeader title="Buku Tamu" subtitle={`${msgs.length} ucapan · ${pending} menunggu approval`} />

      <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
        {(["all", "approved", "hidden"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
              border: filter === f ? "1px solid #C9A96E" : "1px solid #e5e7eb",
              background: filter === f ? "#C9A96E" : "#fff",
              color: filter === f ? "#fff" : "#374151",
            }}
          >
            {f === "all" ? "Semua" : f === "approved" ? "Tampil" : "Tersembunyi"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {filtered.map((m) => (
          <div
            key={m.id}
            style={{
              background: "#fff", borderRadius: 8, padding: "1.25rem",
              border: "1px solid #e5e7eb",
              borderLeft: `3px solid ${m.is_approved ? "#C9A96E" : "#e5e7eb"}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>{m.name}</div>
              <button onClick={() => remove(m.id)} title="Hapus" style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>🗑</button>
            </div>
            {m.location && <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>📍 {m.location}</div>}
            <div style={{ fontSize: "0.875rem", lineHeight: 1.7, marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>{m.message}</div>
            <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "0.75rem" }}>{relativeTimeId(m.created_at)}</div>
            <button
              onClick={() => toggle(m.id, m.is_approved)}
              style={{
                marginTop: 10, padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: "transparent",
                border: `1px solid ${m.is_approved ? "#fca5a5" : "#86efac"}`,
                color: m.is_approved ? "#b91c1c" : "#166534",
              }}
            >
              {m.is_approved ? "🙈 Sembunyikan" : "✅ Tampilkan"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: "#9ca3af" }}>Tidak ada ucapan.</div>}
      </div>
    </>
  );
}
