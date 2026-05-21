import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { useTheme } from "@/components/ThemeProvider";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];
type Theme = "elegant" | "floral" | "modern-dark" | "javanese";

function PhotoCircle({
  src,
  emoji,
  theme,
}: {
  src: string | null | undefined;
  emoji: string;
  theme: Theme;
}) {
  const base: React.CSSProperties = {
    width: 160,
    height: 160,
    borderRadius: "9999px",
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
  }
  if (src) {
    return <img src={src} alt="" style={base} />;
  }
  return <div style={base}>{emoji}</div>;
}

function Person({
  photo,
  name,
  father,
  mother,
  emoji,
  theme,
}: {
  photo: string | null | undefined;
  name: string;
  father: string | null | undefined;
  mother: string | null | undefined;
  emoji: string;
  theme: Theme;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <PhotoCircle src={photo} emoji={emoji} theme={theme} />
      <div
        className="heading-font"
        style={{
          fontSize: "1.6rem",
          color: "var(--color-primary)",
          fontWeight: 400,
          marginTop: "1.25rem",
          marginBottom: "0.25rem",
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: "0.82rem", opacity: 0.65 }}>Putri/Putra dari</div>
      <div
        style={{
          fontSize: "0.8rem",
          opacity: 0.6,
          lineHeight: 1.7,
          marginTop: "0.35rem",
          whiteSpace: "pre-line",
        }}
      >
        {father ?? "—"}
        {"\n& "}
        {mother ?? "—"}
      </div>
    </div>
  );
}

export function CoupleSection({ setting }: { setting: Setting }) {
  const { theme } = useTheme();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 520;

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
          Dengan Penuh Cinta &amp; Syukur
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto 1fr",
            gap: "2rem",
            alignItems: "center",
            marginTop: "3rem",
          }}
        >
          <Person
            photo={setting.bride_photo}
            name={setting.bride_full_name ?? setting.bride_name ?? "Mempelai Wanita"}
            father={setting.bride_father}
            mother={setting.bride_mother}
            emoji="👰"
            theme={theme}
          />
          {!isMobile && (
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
          )}
          <Person
            photo={setting.groom_photo}
            name={setting.groom_full_name ?? setting.groom_name ?? "Mempelai Pria"}
            father={setting.groom_father}
            mother={setting.groom_mother}
            emoji="🤵"
            theme={theme}
          />
        </div>
      </FadeIn>
    </section>
  );
}
