import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { useTheme } from "@/components/ThemeProvider";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];
type Theme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation";

function useIsMobile(breakpoint = 640) {
  const [m, setM] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const h = () => setM(window.innerWidth < breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return m;
}

function PhotoFrame({
  src,
  emoji,
  theme,
}: {
  src: string | null | undefined;
  emoji: string;
  theme: Theme;
}) {
  const isLeafitation = theme === "leafitation";
  const base: React.CSSProperties = {
    width: isLeafitation ? "min(200px, 55vw)" : 160,
    height: isLeafitation ? "min(260px, 72vw)" : 160,
    borderRadius: isLeafitation ? "999px" : "9999px",
    objectFit: "cover",
    border: "3px solid var(--color-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    background: "var(--color-secondary)",
    margin: "0 auto",
  };
  if (theme === "floral") {
    base.boxShadow = "0 6px 24px rgba(255,182,193,0.3)";
  } else if (theme === "modern-dark") {
    base.boxShadow = "0 0 30px color-mix(in oklab, var(--color-primary) 25%, transparent)";
  } else if (theme === "javanese") {
    base.outline = "1px solid var(--color-primary)";
    base.outlineOffset = "4px";
  } else if (theme === "leafitation") {
    base.boxShadow = "0 8px 40px rgba(74,124,89,0.2)";
    base.outline = "3px solid var(--color-secondary)";
    base.outlineOffset = "4px";
  }
  if (src) {
    return <img src={src} alt="" style={base} />;
  }
  return <div style={base}>{emoji}</div>;
}

function Person({
  photo,
  scriptName,
  fullName,
  father,
  mother,
  instagram,
  emoji,
  theme,
}: {
  photo: string | null | undefined;
  scriptName: string;
  fullName: string | null | undefined;
  father: string | null | undefined;
  mother: string | null | undefined;
  instagram: string | null | undefined;
  emoji: string;
  theme: Theme;
}) {
  return (
    <div className="flex flex-col items-center text-center" style={{ gap: "0.75rem" }}>
      <PhotoFrame src={photo} emoji={emoji} theme={theme} />

      {/* Script/italic name (short name) */}
      <div
        className="heading-font"
        style={{
          fontSize: "clamp(1.8rem, 6vw, 2.4rem)",
          color: "var(--color-primary)",
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.1,
          marginTop: "0.5rem",
        }}
      >
        {scriptName}
      </div>

      {/* Full name */}
      {fullName && (
        <div
          className="uppercase"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            fontWeight: 600,
            opacity: 0.75,
          }}
        >
          {fullName}
        </div>
      )}

      {/* Parents */}
      {(father || mother) && (
        <div style={{ fontSize: "0.82rem", lineHeight: 1.8, opacity: 0.6 }}>
          <div style={{ fontSize: "0.72rem", opacity: 0.7, marginBottom: "0.2rem" }}>
            Putra/i dari
          </div>
          {father && <div>{father}</div>}
          {mother && <div>& {mother}</div>}
        </div>
      )}

      {/* Instagram handle */}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace(/^@/, "")}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.78rem",
            color: "var(--color-primary)",
            textDecoration: "none",
            opacity: 0.85,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
          </svg>
          {instagram.startsWith("@") ? instagram : `@${instagram}`}
        </a>
      )}
    </div>
  );
}

export function CoupleSection({ setting }: { setting: Setting }) {
  const { theme } = useTheme();
  const isMobile = useIsMobile(640);

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
          Mempelai
        </div>
        <h2
          className="heading-font"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: 300,
            margin: "1rem 0",
            color: "var(--color-text)",
          }}
        >
          Bride &amp; Groom
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.9,
            opacity: 0.72,
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu dalam hari
          bahagia kami.
        </p>
      </FadeIn>

      <FadeIn delay={150}>
        {isMobile ? (
          /* Mobile: vertical stack */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", marginTop: "3rem" }}>
            <Person
              photo={setting.bride_photo}
              scriptName={setting.bride_name ?? "Mempelai Wanita"}
              fullName={setting.bride_full_name}
              father={setting.bride_father}
              mother={setting.bride_mother}
              instagram={setting.bride_instagram}
              emoji="👰"
              theme={theme}
            />
            <div
              className="heading-font"
              style={{
                fontSize: "3rem",
                color: "var(--color-primary)",
                opacity: 0.35,
                lineHeight: 1,
              }}
            >
              &amp;
            </div>
            <Person
              photo={setting.groom_photo}
              scriptName={setting.groom_name ?? "Mempelai Pria"}
              fullName={setting.groom_full_name}
              father={setting.groom_father}
              mother={setting.groom_mother}
              instagram={setting.groom_instagram}
              emoji="🤵"
              theme={theme}
            />
          </div>
        ) : (
          /* Desktop: 3-column grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "2rem",
              alignItems: "center",
              marginTop: "3rem",
            }}
          >
            <Person
              photo={setting.bride_photo}
              scriptName={setting.bride_name ?? "Mempelai Wanita"}
              fullName={setting.bride_full_name}
              father={setting.bride_father}
              mother={setting.bride_mother}
              instagram={setting.bride_instagram}
              emoji="👰"
              theme={theme}
            />
            <div
              className="heading-font"
              style={{
                fontSize: "3rem",
                color: "var(--color-primary)",
                opacity: 0.4,
              }}
            >
              &amp;
            </div>
            <Person
              photo={setting.groom_photo}
              scriptName={setting.groom_name ?? "Mempelai Pria"}
              fullName={setting.groom_full_name}
              father={setting.groom_father}
              mother={setting.groom_mother}
              instagram={setting.groom_instagram}
              emoji="🤵"
              theme={theme}
            />
          </div>
        )}
      </FadeIn>
    </section>
  );
}
