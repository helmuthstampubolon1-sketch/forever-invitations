import type { Database } from "@/integrations/supabase/types";
import { useSettingSaver, SaveButton, fieldStyle, labelStyle, inputCls } from "./_shared";

type WS = Database["public"]["Tables"]["wedding_settings"]["Row"];

function extractIframeSrc(html: string): string {
  const m = html.match(/src=["']([^"']+)["']/);
  return m ? m[1] : html;
}

export function EventDetailTab({ setting }: { setting: WS }) {
  const { form, setField, save, saving } = useSettingSaver<WS>(setting);

  const col = (prefix: "akad" | "resepsi", label: string) => (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#C9A96E" }}>{label}</h3>
      <div style={fieldStyle}>
        <label style={labelStyle}>Tanggal & Waktu</label>
        <input
          type="datetime-local"
          className={inputCls}
          value={form[`${prefix}_datetime` as keyof WS] ? new Date(form[`${prefix}_datetime` as keyof WS] as string).toISOString().slice(0, 16) : ""}
          onChange={(e) => setField(`${prefix}_datetime` as keyof WS, (e.target.value ? new Date(e.target.value).toISOString() : null) as WS[keyof WS])}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Nama Venue</label>
        <input className={inputCls} value={(form[`${prefix}_venue` as keyof WS] as string) || ""} onChange={(e) => setField(`${prefix}_venue` as keyof WS, e.target.value as WS[keyof WS])} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Alamat Lengkap</label>
        <textarea className={inputCls} rows={3} value={(form[`${prefix}_address` as keyof WS] as string) || ""} onChange={(e) => setField(`${prefix}_address` as keyof WS, e.target.value as WS[keyof WS])} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Link Google Maps</label>
        <input className={inputCls} value={(form[`${prefix}_maps_url` as keyof WS] as string) || ""} onChange={(e) => setField(`${prefix}_maps_url` as keyof WS, e.target.value as WS[keyof WS])} />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Embed Maps (iframe HTML atau URL src)</label>
        <textarea
          className={inputCls} rows={3}
          value={(form[`${prefix}_maps_embed` as keyof WS] as string) || ""}
          onChange={(e) => setField(`${prefix}_maps_embed` as keyof WS, extractIframeSrc(e.target.value) as WS[keyof WS])}
        />
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
          Paste kode embed dari Google Maps. Cari lokasi → Share → Embed a map → Copy HTML.
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {col("akad", "Akad Nikah")}
        {col("resepsi", "Resepsi")}
      </div>
      <SaveButton saving={saving} onClick={() => save(setting.id)}>💾 Simpan Detail Acara</SaveButton>
    </div>
  );
}
