import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { EventCard } from "./EventCard";
import { useTheme } from "@/components/ThemeProvider";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];

function toGCalDate(iso: string | null | undefined) {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  } catch {
    return "";
  }
}

function buildCalendarUrl(s: Setting) {
  const bride = s.bride_name ?? "";
  const groom = s.groom_name ?? "";
  const start = toGCalDate(s.akad_datetime ?? s.resepsi_datetime);
  const end = toGCalDate(s.resepsi_datetime ?? s.akad_datetime);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${bride} & ${groom} Wedding`,
    dates: `${start}/${end}`,
    details: `Pernikahan ${bride} & ${groom}`,
    location: s.resepsi_venue ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function EventSection({ setting }: { setting: Setting }) {
  const { theme } = useTheme();
  const [isWide, setIsWide] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 640 : true,
  );
  useEffect(() => {
    const h = () => setIsWide(window.innerWidth >= 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <section
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "5rem 1.5rem",
        textAlign: "center",
      }}
    >
      <FadeIn>
        <SectionDivider />
        <div
          className="uppercase"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.4em",
            color: "var(--color-primary)",
            opacity: 0.75,
          }}
        >
          Tanggal Bahagia
        </div>
        <h2
          className="heading-font"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: 300,
            margin: "1rem 0",
          }}
        >
          Detail Acara
        </h2>
      </FadeIn>

      <FadeIn delay={120}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isWide ? "1fr 1fr" : "1fr",
            gap: "1.5rem",
            marginTop: "2.5rem",
          }}
        >
          <EventCard type="akad" setting={setting} />
          <EventCard type="resepsi" setting={setting} />
        </div>
      </FadeIn>

      {setting.resepsi_maps_embed && (
        <FadeIn delay={200}>
          <iframe
            src={setting.resepsi_maps_embed}
            title="Lokasi Resepsi"
            width="100%"
            height={300}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              border:
                theme === "modern-dark"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "none",
              marginTop: "1.5rem",
              display: "block",
            }}
          />
        </FadeIn>
      )}

      {(setting.akad_datetime || setting.resepsi_datetime) && (
        <FadeIn delay={260}>
          <a
            href={buildCalendarUrl(setting)}
            target="_blank"
            rel="noreferrer"
            className="uppercase inline-flex"
            style={{
              gap: "0.5rem",
              alignItems: "center",
              color: "var(--color-primary)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              borderBottom: "1px solid var(--color-primary)",
              textDecoration: "none",
              padding: "0.6rem 1.5rem",
              marginTop: "1.5rem",
            }}
          >
            📅 Tambah ke Kalender
          </a>
        </FadeIn>
      )}
    </section>
  );
}
