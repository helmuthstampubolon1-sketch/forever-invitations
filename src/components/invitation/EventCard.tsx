import type { Database } from "@/integrations/supabase/types";
import { useTheme } from "@/components/ThemeProvider";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];
type Theme = "elegant" | "floral" | "modern-dark" | "javanese";

function formatDateID(iso: string | null | undefined) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
function formatTimeID(iso: string | null | undefined) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}.${m} WIB`;
  } catch {
    return "";
  }
}

function cardStyle(theme: Theme): React.CSSProperties {
  switch (theme) {
    case "floral":
      return {
        background: "#fff",
        border: "1px solid rgba(255,182,193,0.4)",
        borderRadius: 16,
        boxShadow: "0 8px 30px rgba(255,150,170,0.08)",
      };
    case "modern-dark":
      return {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 2,
        color: "#fff",
      };
    case "javanese":
      return {
        background: "var(--color-secondary)",
        border: "2px solid var(--color-primary)",
        outline: "1px solid var(--color-primary)",
        outlineOffset: 3,
      };
    default:
      return {
        background: "var(--color-secondary)",
        border: "1px solid color-mix(in oklab, var(--color-primary) 18%, transparent)",
      };
  }
}

export function EventCard({
  type,
  setting,
}: {
  type: "akad" | "resepsi";
  setting: Setting;
}) {
  const { theme } = useTheme();
  const isAkad = type === "akad";
  const label = isAkad ? "Akad Nikah" : "Resepsi Pernikahan";
  const venue = isAkad ? setting.akad_venue : setting.resepsi_venue;
  const address = isAkad ? setting.akad_address : setting.resepsi_address;
  const dt = isAkad ? setting.akad_datetime : setting.resepsi_datetime;
  const mapsUrl = isAkad ? setting.akad_maps_url : setting.resepsi_maps_url;

  return (
    <div
      style={{
        ...cardStyle(theme),
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        className="uppercase"
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.35em",
          color: "var(--color-primary)",
          marginBottom: "1rem",
        }}
      >
        {label}
      </div>
      <div
        className="heading-font"
        style={{
          fontSize: "1.75rem",
          marginBottom: "1rem",
          color: theme === "modern-dark" ? "var(--color-primary)" : undefined,
        }}
      >
        {venue ?? "-"}
      </div>
      <div style={{ lineHeight: 2.1, fontSize: "0.875rem", opacity: 0.78 }}>
        <div>📅 {formatDateID(dt)}</div>
        <div>⏰ {formatTimeID(dt)}</div>
        <div style={{ height: "0.5rem" }} />
        <div>📍 {address ?? "-"}</div>
      </div>
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="uppercase inline-flex"
          style={{
            gap: "0.5rem",
            alignItems: "center",
            color: "var(--color-primary)",
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            borderBottom: "1px solid var(--color-primary)",
            textDecoration: "none",
            marginTop: "1.25rem",
            paddingBottom: 2,
          }}
        >
          🗺 Lihat Lokasi
        </a>
      )}
    </div>
  );
}
