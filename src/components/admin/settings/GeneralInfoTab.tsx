import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { useSettingSaver, SaveButton, fieldStyle, labelStyle, inputCls } from "./_shared";
import { uploadToBucket } from "@/lib/storage";
import { showToast } from "@/hooks/useToast";

type WS = Database["public"]["Tables"]["wedding_settings"]["Row"];

export function GeneralInfoTab({ setting }: { setting: WS }) {
  const { form, setField, save, saving } = useSettingSaver<WS>(setting);
  const [uploading, setUploading] = useState<"groom" | "bride" | null>(null);

  const upload = async (kind: "groom" | "bride", file: File) => {
    setUploading(kind);
    try {
      const url = await uploadToBucket("photos", file);
      setField(kind === "groom" ? "groom_photo" : "bride_photo", url);
      showToast("Foto terupload");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(null);
    }
  };

  const col = (prefix: "groom" | "bride", label: string) => (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#C9A96E" }}>{label}</h3>
      {([
        ["name", "Nama Panggilan"],
        ["full_name", "Nama Lengkap"],
        ["father", "Nama Ayah"],
        ["mother", "Nama Ibu"],
      ] as const).map(([k, lbl]) => {
        const key = `${prefix}_${k}` as keyof WS;
        return (
          <div key={String(key)} style={fieldStyle}>
            <label style={labelStyle}>{lbl}</label>
            <input
              className={inputCls}
              value={(form[key] as string) || ""}
              onChange={(e) => setField(key, e.target.value as WS[typeof key])}
            />
          </div>
        );
      })}
      <div style={fieldStyle}>
        <label style={labelStyle}>Foto</label>
        <input
          type="file" accept="image/*"
          onChange={(e) => e.target.files?.[0] && upload(prefix, e.target.files[0])}
        />
        {uploading === prefix && <div style={{ fontSize: 11, color: "#6b7280" }}>Mengupload…</div>}
        {form[`${prefix}_photo` as keyof WS] && (
          <img src={form[`${prefix}_photo` as keyof WS] as string} alt="" style={{ height: 60, objectFit: "cover", borderRadius: 6, marginTop: 8 }} />
        )}
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Instagram Handle</label>
        <input
          className={inputCls}
          placeholder="@username"
          value={(form[`${prefix}_instagram` as keyof WS] as string) || ""}
          onChange={(e) => setField(`${prefix}_instagram` as keyof WS, e.target.value as WS[keyof WS])}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {col("groom", "Mempelai Pria")}
        {col("bride", "Mempelai Wanita")}
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Opening Quote</label>
        <textarea className={inputCls} rows={3} value={form.opening_quote || ""} onChange={(e) => setField("opening_quote", e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Sumber Quote</label>
        <input className={inputCls} value={form.opening_quote_source || ""} onChange={(e) => setField("opening_quote_source", e.target.value)} />
      </div>
      <div style={{ ...fieldStyle, display: "flex", gap: 24, alignItems: "center" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={!!form.rsvp_open} onChange={(e) => setField("rsvp_open", e.target.checked)} />
          RSVP Open
        </label>
        <div>
          <label style={labelStyle}>RSVP Deadline</label>
          <input type="date" className={inputCls} value={form.rsvp_deadline || ""} onChange={(e) => setField("rsvp_deadline", e.target.value)} />
        </div>
      </div>
      <SaveButton saving={saving} onClick={() => save(setting.id)}>💾 Simpan Informasi</SaveButton>
    </div>
  );
}
