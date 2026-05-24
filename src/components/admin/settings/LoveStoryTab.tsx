import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLoveStory } from "@/hooks/useLoveStory";
import { getSupabase } from "@/lib/supabaseClient";
import { showToast } from "@/hooks/useToast";
import { uploadToBucket } from "@/lib/storage";
import type { Database } from "@/integrations/supabase/types";
import { fieldStyle, labelStyle, inputCls } from "./_shared";

type Icon = Database["public"]["Enums"]["love_icon"];
const ICONS: Array<{ v: Icon; label: string }> = [
  { v: "heart", label: "♥ Heart" },
  { v: "ring", label: "💍 Ring" },
  { v: "home", label: "🏠 Home" },
  { v: "star", label: "★ Star" },
];

export function LoveStoryTab() {
  const { data: items = [] } = useLoveStory();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [icon, setIcon] = useState<Icon>("heart");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!title.trim() || !content.trim()) return showToast("Judul & cerita wajib");
    setSaving(true);
    const sb = await getSupabase();
    const { error } = await sb.from("love_story_items").insert({
      title, content, icon, location: location || null,
      event_date: date || null, photo,
      display_order: items.length,
    });
    setSaving(false);
    if (error) return showToast(error.message);
    setTitle(""); setDate(""); setLocation(""); setContent(""); setPhoto(null);
    qc.invalidateQueries({ queryKey: ["love_story_items"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus?")) return;
    const sb = await getSupabase();
    await sb.from("love_story_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["love_story_items"] });
  };

  const onPhoto = async (f: File) => {
    try { setPhoto(await uploadToBucket("lovestory", f)); } catch (e) { showToast((e as Error).message); }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {items.map((it) => (
          <div key={it.id} style={{ background: "#fff", borderRadius: 8, padding: "1rem", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 500 }}>{ICONS.find((i) => i.v === it.icon)?.label.split(" ")[0]} {it.title}</div>
              {it.event_date && <div style={{ fontSize: 12, color: "#6b7280" }}>{it.event_date}</div>}
              <div style={{ fontSize: 13, marginTop: 4, color: "#374151" }}>{it.content.slice(0, 100)}{it.content.length > 100 ? "…" : ""}</div>
            </div>
            <button onClick={() => remove(it.id)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}>🗑</button>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>+ Tambah Cerita Baru</h3>
      <div style={fieldStyle}><label style={labelStyle}>Judul *</label><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={fieldStyle}><label style={labelStyle}>Tanggal</label><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div style={fieldStyle}><label style={labelStyle}>Lokasi</label><input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} /></div>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Icon</label>
        <select className={inputCls} value={icon} onChange={(e) => setIcon(e.target.value as Icon)}>
          {ICONS.map((i) => <option key={i.v} value={i.v}>{i.label}</option>)}
        </select>
      </div>
      <div style={fieldStyle}><label style={labelStyle}>Cerita *</label><textarea rows={4} className={inputCls} value={content} onChange={(e) => setContent(e.target.value)} /></div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Foto (opsional)</label>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])} />
        {photo && <img src={photo} alt="" style={{ height: 60, marginTop: 6, borderRadius: 4 }} />}
      </div>
      <button onClick={add} disabled={saving} style={{ background: "#C9A96E", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: 8, cursor: "pointer", marginTop: 8 }}>
        {saving ? "Menyimpan…" : "💾 Tambah Cerita"}
      </button>
    </div>
  );
}
