import type { Database } from "@/integrations/supabase/types";
import { useSettingSaver, SaveButton, fieldStyle, labelStyle, inputCls } from "./_shared";

type WS = Database["public"]["Tables"]["wedding_settings"]["Row"];
type ThemeKey = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation" | "bobby";

const THEMES: Array<{
  key: ThemeKey; label: string; subtitle: string;
  previewBg: string; previewText: string; previewFont: string;
  swatches: string[];
  defaults: Partial<WS>;
}> = [
  {
    key: "elegant", label: "Elegant", subtitle: "Putih · Emas · Serif",
    previewBg: "#F5F0E8", previewText: "#8B6914", previewFont: "Georgia, serif",
    swatches: ["#F5F0E8", "#C9A96E", "#8B6914", "#2C2C2C", "#E8E0D0"],
    defaults: { primary_color: "#C9A96E", secondary_color: "#F5F0E8", accent_color: "#8B6914", text_color: "#2C2C2C", background_color: "#FFFFFF", heading_font: "Cormorant Garamond", body_font: "Lato", ornament_style: "classic" },
  },
  {
    key: "floral", label: "Floral", subtitle: "Pastel · Bunga · Romantis",
    previewBg: "linear-gradient(135deg,#fff5f7,#f5fff7)", previewText: "#C0607A", previewFont: "Georgia, serif",
    swatches: ["#FFF5F7", "#E8A0B0", "#C0607A", "#4A3040", "#A8D8A8"],
    defaults: { primary_color: "#E8A0B0", secondary_color: "#FFF5F7", accent_color: "#C0607A", text_color: "#4A3040", background_color: "#FFFFFF", heading_font: "Playfair Display", body_font: "Nunito", ornament_style: "botanical" },
  },
  {
    key: "modern-dark", label: "Modern Dark", subtitle: "Hitam · Kontemporer · Bold",
    previewBg: "#0d0d0d", previewText: "#E8C56E", previewFont: "Impact, sans-serif",
    swatches: ["#0D0D0D", "#E8C56E", "#C8A030", "#FFFFFF", "#1E1E2E"],
    defaults: { primary_color: "#E8C56E", secondary_color: "#1E1E2E", accent_color: "#C8A030", text_color: "#FFFFFF", background_color: "#0D0D0D", heading_font: "Bebas Neue", body_font: "DM Sans", ornament_style: "geometric" },
  },
  {
    key: "javanese", label: "Javanese", subtitle: "Batik · Tradisional · Jawa",
    previewBg: "#FDF6EC", previewText: "#7B4F1E", previewFont: "Georgia, serif",
    swatches: ["#FDF6EC", "#B8732A", "#7B4F1E", "#2C1A0E", "#4A8B5C"],
    defaults: { primary_color: "#B8732A", secondary_color: "#FDF6EC", accent_color: "#7B4F1E", text_color: "#2C1A0E", background_color: "#FEFAF4", heading_font: "Noto Serif", body_font: "Noto Sans", ornament_style: "batik" },
  },
  {
    key: "leafitation", label: "Leafitation", subtitle: "Hijau Hutan · Krem Hangat · Botanical",
    previewBg: "linear-gradient(135deg,#f0f7f2,#fdfaf5)", previewText: "#4A7C59", previewFont: "Georgia, serif",
    swatches: ["#4A7C59", "#E8F3EC", "#C9A96E", "#2C2C2C", "#FDFAF5"],
    defaults: { primary_color: "#4A7C59", secondary_color: "#E8F3EC", accent_color: "#C9A96E", text_color: "#2C2C2C", background_color: "#FDFAF5", heading_font: "Libre Baskerville", body_font: "Inter", ornament_style: "botanical" },
  },
  {
    key: "bobby", label: "Bobby", subtitle: "Vintage Botanical · Hutan Klasik · Terakota",
    previewBg: "linear-gradient(135deg,#2a332c 0%,#3d4a3f 60%,#5a4a32 100%)", previewText: "#E4DCC8", previewFont: "'Cormorant Garamond', Georgia, serif",
    swatches: ["#2A332C", "#3D5641", "#B5814A", "#E4DCC8", "#1A1F1B"],
    defaults: { primary_color: "#d9b886", secondary_color: "rgba(228, 220, 200, 0.08)", accent_color: "#b5814a", text_color: "#f4ede0", background_color: "#1f2620", heading_font: "Cormorant Garamond", body_font: "Lato", ornament_style: "botanical" },
  },
];

const HEADING_FONTS = ["Cormorant Garamond", "Playfair Display", "Lora", "EB Garamond", "Bebas Neue", "Montserrat", "DM Sans", "Noto Serif", "Noto Sans"];
const BODY_FONTS = ["Lato", "Nunito", "DM Sans", "Inter", "Open Sans", "Noto Sans", "Source Sans 3"];
const ORNAMENTS = ["classic", "botanical", "geometric", "batik"];

export function ThemeTab({ setting }: { setting: WS }) {
  const { form, setField, save, saving } = useSettingSaver<WS>(setting);
  const selected = form.theme as ThemeKey;

  const applyDefaults = (key: ThemeKey) => {
    const t = THEMES.find((x) => x.key === key)!;
    Object.entries({ ...t.defaults, theme: key }).forEach(([k, v]) =>
      setField(k as keyof WS, v as WS[keyof WS]),
    );
  };

  const ColorPicker = ({ label, k }: { label: string; k: keyof WS }) => (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="color" value={(form[k] as string) || "#000000"} onChange={(e) => setField(k, e.target.value as WS[typeof k])} style={{ width: 40, height: 32, border: "none", cursor: "pointer" }} />
        <input className={inputCls} style={{ maxWidth: 120 }} value={(form[k] as string) || ""} onChange={(e) => setField(k, e.target.value as WS[typeof k])} />
      </div>
    </div>
  );

  return (
    <div>
      <h3 style={sect}>Pilih Tema</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 24 }}>
        {THEMES.map((t) => {
          const sel = t.key === selected;
          return (
            <div
              key={t.key}
              onClick={() => setField("theme", t.key as WS["theme"])}
              style={{
                border: `2px solid ${sel ? "#C9A96E" : "transparent"}`,
                boxShadow: sel ? "0 0 0 3px rgba(201,169,110,0.2)" : "0 0 0 1px #e5e7eb",
                borderRadius: 12, padding: 16, cursor: "pointer", background: "#fff",
              }}
            >
              <div style={{ height: 52, borderRadius: 8, background: t.previewBg, color: t.previewText, fontFamily: t.previewFont, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                {(form.bride_name || "Bride")} & {(form.groom_name || "Groom")}
              </div>
              <div style={{ marginTop: 10, fontWeight: 500 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{t.subtitle}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {t.swatches.map((c) => <span key={c} style={{ width: 18, height: 18, borderRadius: 999, background: c, border: "1px solid #e5e7eb" }} />)}
              </div>
              {sel && (
                <button onClick={(e) => { e.stopPropagation(); applyDefaults(t.key); }} style={{ marginTop: 8, background: "none", border: "none", color: "#C9A96E", fontSize: 11, cursor: "pointer", padding: 0 }}>
                  🔄 Reset ke default tema ini
                </button>
              )}
            </div>
          );
        })}
      </div>

      <h3 style={sect}>Warna Custom</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <ColorPicker label="Primary" k="primary_color" />
        <ColorPicker label="Secondary" k="secondary_color" />
        <ColorPicker label="Accent" k="accent_color" />
        <ColorPicker label="Text" k="text_color" />
        <ColorPicker label="Background" k="background_color" />
      </div>

      <h3 style={sect}>Typography</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <div>
          <label style={labelStyle}>Heading Font</label>
          <select className={inputCls} value={form.heading_font || ""} onChange={(e) => setField("heading_font", e.target.value)}>
            {HEADING_FONTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Body Font</label>
          <select className={inputCls} value={form.body_font || ""} onChange={(e) => setField("body_font", e.target.value)}>
            {BODY_FONTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Ornament Style</label>
          <select className={inputCls} value={form.ornament_style || ""} onChange={(e) => setField("ornament_style", e.target.value as WS["ornament_style"])}>
            {ORNAMENTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <h3 style={sect}>🔁 Preview Langsung</h3>
      <div style={{ maxWidth: 480, margin: "0 auto", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: (form.background_color || "#fff") as string, color: (form.text_color || "#000") as string }}>
        <div style={{ padding: 32, textAlign: "center", fontFamily: `'${form.heading_font || "serif"}', serif` }}>
          <div style={{ fontSize: 28, color: form.primary_color || "#000" }}>{form.bride_name} & {form.groom_name}</div>
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7, fontFamily: `'${form.body_font || "sans-serif"}', sans-serif` }}>The Wedding Of</div>
        </div>
        <div style={{ height: 1, background: form.accent_color || "#ccc", opacity: 0.4, margin: "0 32px" }} />
        <div style={{ padding: 16, fontSize: 12, textAlign: "center", fontFamily: `'${form.body_font || "sans-serif"}', sans-serif` }}>
          Sample Event · {form.akad_venue || "Venue"}
        </div>
      </div>

      <SaveButton saving={saving} onClick={() => save(setting.id)}>💾 Simpan Tema & Tampilan</SaveButton>
    </div>
  );
}

const sect: React.CSSProperties = { fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginTop: 24, marginBottom: 12 };
