import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { useSettingSaver, SaveButton, fieldStyle, labelStyle, inputCls } from "./_shared";
import { uploadToBucket } from "@/lib/storage";
import { showToast } from "@/hooks/useToast";

type WS = Database["public"]["Tables"]["wedding_settings"]["Row"];

export function MediaSeoTab({ setting }: { setting: WS }) {
  const { form, setField, save, saving } = useSettingSaver<WS>(setting);
  const [uploading, setUploading] = useState<string | null>(null);

  const onUpload = async (kind: "music_file" | "og_image", file: File, folder: string) => {
    setUploading(kind);
    try {
      const url = await uploadToBucket(folder, file);
      setField(kind, url);
      showToast("Upload sukses");
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🎵 Musik Latar</h3>
      {form.music_file && (
        <div style={{ fontSize: 13, marginBottom: 8 }}>
          File: <a href={form.music_file} target="_blank" rel="noreferrer">{form.music_file.split("/").pop()}</a>{" "}
          <button onClick={() => setField("music_file", null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b91c1c" }}>🗑 Hapus</button>
        </div>
      )}
      <div style={fieldStyle}>
        <input type="file" accept="audio/mpeg,audio/mp3" onChange={(e) => e.target.files?.[0] && onUpload("music_file", e.target.files[0], "music")} />
        {uploading === "music_file" && <span style={{ fontSize: 12 }}> Mengupload…</span>}
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Judul Musik</label>
        <input className={inputCls} value={form.music_title || ""} onChange={(e) => setField("music_title", e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={!!form.music_autoplay} onChange={(e) => setField("music_autoplay", e.target.checked)} />
          Autoplay musik
        </label>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>🖼 OG Image</h3>
      {form.og_image && <img src={form.og_image} alt="" style={{ maxWidth: 240, marginBottom: 8, borderRadius: 6 }} />}
      <div style={fieldStyle}>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpload("og_image", e.target.files[0], "og")} />
        {uploading === "og_image" && <span style={{ fontSize: 12 }}> Mengupload…</span>}
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Rekomendasi 1200x630px</div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>📝 Meta Description</h3>
      <div style={fieldStyle}>
        <textarea
          className={inputCls} rows={3} maxLength={160}
          value={form.meta_description || ""}
          onChange={(e) => setField("meta_description", e.target.value)}
        />
        <div style={{ fontSize: 11, color: "#6b7280", textAlign: "right" }}>{(form.meta_description || "").length} / 160</div>
      </div>

      <SaveButton saving={saving} onClick={() => save(setting.id)}>💾 Simpan Media & SEO</SaveButton>
    </div>
  );
}
