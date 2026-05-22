import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { AddGuestModal } from "@/components/admin/AddGuestModal";
import { BulkAddModal } from "@/components/admin/BulkAddModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabaseClient";
import { showToast } from "@/hooks/useToast";
import type { Database } from "@/integrations/supabase/types";

type Guest = Database["public"]["Tables"]["guests"]["Row"];
type Rsvp = Database["public"]["Tables"]["rsvps"]["Row"];
type Category = Database["public"]["Enums"]["guest_category"];

export const Route = createFileRoute("/admin/guests")({
  component: () => (
    <AdminAuthGuard>
      <AdminLayout activePage="guests">
        <AdminGuests />
      </AdminLayout>
    </AdminAuthGuard>
  ),
});

const CAT_STYLE: Record<Category, { bg: string; color: string }> = {
  family: { bg: "#ede9fe", color: "#5b21b6" },
  friend: { bg: "#dbeafe", color: "#1e40af" },
  colleague: { bg: "#ffedd5", color: "#9a3412" },
  other: { bg: "#f3f4f6", color: "#374151" },
};

const ATT_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  hadir: { bg: "#dcfce7", color: "#166534", label: "Hadir" },
  tidak_hadir: { bg: "#fee2e2", color: "#991b1b", label: "Tidak Hadir" },
  mungkin: { bg: "#fef9c3", color: "#854d0e", label: "Mungkin" },
};

const PAGE_SIZE = 20;

function AdminGuests() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [page, setPage] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const guests = useQuery({
    queryKey: ["admin", "guests"],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Guest[];
    },
  });

  const rsvps = useQuery({
    queryKey: ["admin", "rsvps-by-guest"],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const map = new Map<string, Rsvp>();
      for (const r of (data ?? []) as Rsvp[]) {
        if (r.guest_id && !map.has(r.guest_id)) map.set(r.guest_id, r);
      }
      return map;
    },
  });

  const filtered = useMemo(() => {
    const list = guests.data ?? [];
    return list.filter((g) => {
      if (cat !== "all" && g.category !== cat) return false;
      if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [guests.data, cat, search]);

  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  async function refetch() {
    await guests.refetch();
  }

  async function handleDelete(g: Guest) {
    if (!confirm(`Hapus tamu "${g.name}"?`)) return;
    const supabase = await getSupabase();
    const { error } = await supabase.from("guests").delete().eq("id", g.id);
    if (error) showToast(error.message);
    else { showToast("Tamu dihapus"); refetch(); }
  }

  function copyLink(g: Guest) {
    const url = `${window.location.origin}/untuk/${g.slug}`;
    navigator.clipboard.writeText(url).then(
      () => showToast("Link disalin"),
      () => showToast("Gagal menyalin"),
    );
  }

  function waUrl(g: Guest) {
    const url = `${window.location.origin}/untuk/${g.slug}`;
    const text = `Halo ${g.name}, kami mengundangmu ke acara pernikahan kami. Detail undangan: ${url}`;
    const phone = (g.phone ?? "").replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  function exportCSV() {
    const rows = ["Nama,Link Undangan,WhatsApp Link"];
    for (const g of guests.data ?? []) {
      if (!g.is_active) continue;
      const link = `${window.location.origin}/untuk/${g.slug}`;
      const wa = g.phone ? waUrl(g) : "";
      const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
      rows.push([esc(g.name), esc(link), esc(wa)].join(","));
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daftar-tamu-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminPageHeader
        title="Kelola Tamu"
        subtitle={`${guests.data?.length ?? 0} tamu terdaftar`}
        action={
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="outline" onClick={exportCSV}>📤 Export CSV</Button>
            <Button variant="outline" onClick={() => setShowBulk(true)}>➕ Bulk Tambah</Button>
            <Button onClick={() => setShowAdd(true)} style={{ background: "#C9A96E", color: "#fff" }}>
              ➕ Tambah Tamu
            </Button>
          </div>
        }
      />

      <AdminCard>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <Input
            placeholder="Cari nama tamu..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            style={{ maxWidth: 280 }}
          />
          <select
            value={cat}
            onChange={(e) => { setCat(e.target.value as typeof cat); setPage(0); }}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">Semua Kategori</option>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "0.72rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.6rem" }}>Nama</th>
                <th style={{ padding: "0.6rem" }}>Kategori</th>
                <th style={{ padding: "0.6rem" }}>Status Buka</th>
                <th style={{ padding: "0.6rem" }}>RSVP</th>
                <th style={{ padding: "0.6rem" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((g) => {
                const cs = CAT_STYLE[g.category as Category];
                const r = rsvps.data?.get(g.id);
                const rs = r ? ATT_STYLE[r.attendance] : null;
                return (
                  <tr key={g.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.75rem 0.6rem", fontWeight: 500 }}>{g.name}</td>
                    <td style={{ padding: "0.75rem 0.6rem" }}>
                      <span style={{ background: cs.bg, color: cs.color, padding: "0.15rem 0.5rem", borderRadius: 6, fontSize: "0.72rem", textTransform: "capitalize" }}>
                        {g.category}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.6rem" }}>
                      {g.opened_at ? (
                        <span style={{ color: "#166534", fontSize: "0.78rem" }}>✓ Sudah buka</span>
                      ) : (
                        <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>Belum dibuka</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 0.6rem" }}>
                      {rs ? (
                        <span style={{ background: rs.bg, color: rs.color, padding: "0.15rem 0.5rem", borderRadius: 6, fontSize: "0.72rem" }}>
                          {rs.label}
                        </span>
                      ) : (
                        <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>Belum RSVP</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 0.6rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button title="Copy link" onClick={() => copyLink(g)} style={iconBtn}>🔗</button>
                        {g.phone && (
                          <a title="WhatsApp" href={waUrl(g)} target="_blank" rel="noreferrer" style={{ ...iconBtn, textDecoration: "none" }}>
                            💬
                          </a>
                        )}
                        <button title="Hapus" onClick={() => handleDelete(g)} style={{ ...iconBtn, color: "#991b1b" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!pageRows.length && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                    {guests.isLoading ? "Memuat…" : "Tidak ada tamu"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
            <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Sebelumnya</Button>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Halaman {page + 1} dari {totalPages}
            </span>
            <Button variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Berikutnya →</Button>
          </div>
        )}
      </AdminCard>

      <AddGuestModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={refetch} />
      <BulkAddModal open={showBulk} onClose={() => setShowBulk(false)} onSuccess={refetch} />
    </>
  );
}

const iconBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "0.3rem 0.5rem",
  cursor: "pointer",
  fontSize: "0.9rem",
  lineHeight: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
