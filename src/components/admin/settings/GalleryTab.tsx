import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGallery } from "@/hooks/useGallery";
import { uploadToBucket, removeFromBucket } from "@/lib/storage";
import { getSupabase } from "@/lib/supabaseClient";
import { showToast } from "@/hooks/useToast";
import type { Database } from "@/integrations/supabase/types";

type Cat = Database["public"]["Enums"]["gallery_category"];
const CATS: Cat[] = ["prewedding", "couple", "venue", "other"];

export function GalleryTab() {
  const { data: photos = [] } = useGallery();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const sb = await getSupabase();
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          showToast(`${file.name} > 5MB, dilewati`);
          continue;
        }
        const url = await uploadToBucket("gallery", file);
        await sb.from("gallery_photos").insert({ file_path: url, category: "couple", display_order: photos.length });
      }
      showToast("Upload selesai");
      qc.invalidateQueries({ queryKey: ["gallery_photos"] });
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const updateCategory = async (id: string, category: Cat) => {
    const sb = await getSupabase();
    await sb.from("gallery_photos").update({ category }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["gallery_photos"] });
  };

  const remove = async (id: string, url: string) => {
    if (!confirm("Hapus foto ini?")) return;
    const sb = await getSupabase();
    await sb.from("gallery_photos").delete().eq("id", id);
    await removeFromBucket(url).catch(() => {});
    qc.invalidateQueries({ queryKey: ["gallery_photos"] });
  };

  return (
    <div>
      <label
        style={{
          display: "block", border: "2px dashed #C9A96E", borderRadius: 12,
          padding: "2rem", textAlign: "center", cursor: "pointer",
          background: "#fafafa", marginBottom: 20,
        }}
      >
        <input type="file" multiple accept="image/*" hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        {uploading ? "Mengupload…" : "📷 Drag foto ke sini atau klik untuk pilih (max 5MB/file)"}
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
        {photos.map((p) => (
          <div key={p.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 6, overflow: "hidden", background: "#f3f4f6" }}>
            <img src={p.file_path} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              onClick={() => remove(p.id, p.file_path)}
              style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 4, width: 24, height: 24, cursor: "pointer" }}
            >🗑</button>
            <select
              value={p.category}
              onChange={(e) => updateCategory(p.id, e.target.value as Cat)}
              style={{ position: "absolute", bottom: 4, left: 4, fontSize: 10, padding: "2px 4px", border: "none", borderRadius: 4 }}
            >
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
