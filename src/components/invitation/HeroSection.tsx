import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { CountdownTimer } from "./CountdownTimer";
import { useTheme } from "@/components/ThemeProvider";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];
type Guest = Database["public"]["Tables"]["guests"]["Row"];
type Theme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation";

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

const BG: Record<Theme, string> = {
  elegant:
    "linear-gradient(160deg, var(--color-secondary) 0%, #fff 60%, var(--color-secondary) 100%)",
  floral: "linear-gradient(135deg, #fff5f7 0%, #fff 50%, #f5fff7 100%)",
  "modern-dark": "linear-gradient(160deg, #0a0a0a 0%, #1a1a2e 100%)",
  javanese:
    "linear-gradient(160deg, #fdf6ec 0%, #fff 60%, #fdf6ec 100%)",
  leafitation:
    "linear-gradient(160deg, #f0f7f2 0%, #fdfaf5 55%, #eef5f1 100%)",
};

function CornerOrnament({ transform }: { transform: string }) {
  return (
    <svg
      viewBox="0 0 130 130"
      width="130"
      height="130"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      style={{
        position: "absolute",
        color: "var(--color-primary)",
        opacity: 0.1,
        transform,
      }}
    >
      <path d="M5 125 Q5 60 65 60 Q125 60 125 5" />
      <path d="M20 125 Q20 75 80 75" />
      <circle cx="65" cy="60" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FloralLeaf({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width="140"
      height="140"
      fill="currentColor"
      style={{ position: "absolute", color: "var(--color-primary)", opacity: 0.12, ...style }}
    >
      <path d="M60 10 C30 40 30 80 60 110 C90 80 90 40 60 10 Z" />
      <path d="M60 10 L60 110" stroke="#fff" strokeWidth="1" />
    </svg>
  );
}

function BatikCorner({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width="160"
      height="160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      style={{ position: "absolute", color: "var(--color-primary)", opacity: 0.08, ...style }}
    >
      <circle cx="30" cy="30" r="20" />
      <circle cx="30" cy="30" r="10" />
      <path d="M60 10 Q90 30 60 50 Q30 30 60 10" />
      <path d="M10 60 Q30 90 50 60 Q30 30 10 60" />
    </svg>
  );
}

function LeafOrnament({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width="180"
      height="180"
      fill="none"
      style={{ position: "absolute", color: "var(--color-primary)", opacity: 0.12, ...style }}
    >
      {/* Large leaf */}
      <path
        d="M100 10 C50 50 30 120 80 170 C90 140 110 110 100 10Z"
        fill="currentColor"
      />
      {/* Leaf vein */}
      <path d="M100 10 L80 170" stroke="#fff" strokeWidth="1.5" />
      {/* Small side leaf */}
      <path
        d="M90 80 C60 70 40 90 70 110 C75 95 85 85 90 80Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Stem curl */}
      <path
        d="M80 170 Q85 185 95 188 Q105 190 108 180"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function Background({ theme }: { theme: Theme }) {
  if (theme === "elegant") {
    return (
      <>
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <CornerOrnament transform="translate(0,0)" />
        </div>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <CornerOrnament transform="scaleX(-1)" />
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0 }}>
          <CornerOrnament transform="scaleY(-1)" />
        </div>
        <div style={{ position: "absolute", bottom: 0, right: 0 }}>
          <CornerOrnament transform="scale(-1,-1)" />
        </div>
      </>
    );
  }
  if (theme === "floral") {
    return (
      <>
        <FloralLeaf style={{ top: -20, right: -20, transform: "rotate(30deg)" }} />
        <FloralLeaf style={{ bottom: -20, left: -20, transform: "rotate(210deg)" }} />
      </>
    );
  }
  if (theme === "modern-dark") {
    return (
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          color: "#fff",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dotgrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>
    );
  }
  if (theme === "leafitation") {
    return (
      <>
        <LeafOrnament style={{ top: -30, left: -20, transform: "rotate(-20deg)" }} />
        <LeafOrnament style={{ top: -30, right: -20, transform: "rotate(20deg) scaleX(-1)" }} />
        <LeafOrnament style={{ bottom: -30, left: -20, transform: "rotate(200deg)" }} />
        <LeafOrnament style={{ bottom: -30, right: -20, transform: "rotate(160deg) scaleX(-1)" }} />
      </>
    );
  }
  // javanese
  return (
    <>
      <BatikCorner style={{ top: 0, left: 0 }} />
      <BatikCorner style={{ top: 0, right: 0, transform: "scaleX(-1)" }} />
    </>
  );
}

/** Hero couple photo — shown for leafitation / bobby themes */
function CoupleHeroPhoto({ setting }: { setting: Setting }) {
  const heroSrc = setting.couple_photo ?? setting.bride_photo ?? setting.groom_photo;
  if (!heroSrc) return null;

  return (
    <FadeIn delay={250}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          margin: "2.5rem auto 0",
        }}
      >
        <img
          src={heroSrc}
          alt="Foto Mempelai"
          style={{
            width: "100%",
            aspectRatio: "4 / 5",
            objectFit: "cover",
            borderRadius: 24,
            display: "block",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          }}
        />
        {/* Warm overlay tint */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* "WE FOUND LOVE" caption */}
        {setting.opening_quote && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "1.5rem 1.25rem 1.25rem",
              textAlign: "center",
            }}
          >
            <div
              className="heading-font"
              style={{
                color: "#fff",
                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "0.04em",
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              {setting.opening_quote}
            </div>
            {setting.opening_quote_source && (
              <div
                className="uppercase"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.75)",
                  marginTop: "0.5rem",
                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                }}
              >
                — {setting.opening_quote_source}
              </div>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

export function HeroSection({ setting }: { setting: Setting; guest?: Guest | null }) {
  const { theme, rawTheme } = useTheme();
  const dateText = formatDateID(setting.akad_datetime ?? setting.resepsi_datetime);
  const target = setting.akad_datetime ?? setting.resepsi_datetime ?? "";
  const isLeafitationVariant = theme === "leafitation"; // includes bobby

  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "100vh",
        padding: "5rem 1.5rem",
        background: BG[theme],
        color: "var(--color-text)",
      }}
    >
      <Background theme={theme} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 600, margin: "0 auto" }}>
        <FadeIn delay={0}>
          <div
            className="uppercase"
            style={{ fontSize: "0.7rem", letterSpacing: "0.4em", opacity: 0.5 }}
          >
            The Wedding of
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1
            className="heading-font"
            style={{
              color: rawTheme === "bobby" ? "#d9b886" : "var(--color-primary)",
              fontWeight: 300,
              fontSize: "clamp(3rem, 12vw, 7rem)",
              lineHeight: 1.05,
              margin: "1.5rem 0",
            }}
          >
            {setting.bride_name ?? "Bride"}
            <span
              style={{
                display: "block",
                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                color: "var(--color-accent)",
                margin: "0.2rem 0",
              }}
            >
              &amp;
            </span>
            {setting.groom_name ?? "Groom"}
          </h1>
        </FadeIn>

        {dateText && (
          <FadeIn delay={200}>
            <div
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.25em",
                opacity: 0.65,
              }}
            >
              {dateText}
            </div>
          </FadeIn>
        )}

        {/* Couple photo — only for leafitation/bobby */}
        {isLeafitationVariant && <CoupleHeroPhoto setting={setting} />}

        {/* Opening quote — for non-leafitation themes (leafitation shows it in photo caption) */}
        {!isLeafitationVariant && setting.opening_quote && (
          <FadeIn delay={300}>
            <blockquote
              style={{
                fontStyle: "italic",
                maxWidth: 480,
                margin: "2.5rem auto 0",
                lineHeight: 1.9,
                opacity: 0.7,
              }}
            >
              {setting.opening_quote}
              {setting.opening_quote_source && (
                <div
                  className="uppercase"
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.2em",
                    marginTop: "0.75rem",
                    opacity: 0.8,
                  }}
                >
                  — {setting.opening_quote_source}
                </div>
              )}
            </blockquote>
          </FadeIn>
        )}

        {target && (
          <FadeIn delay={300}>
            <CountdownTimer targetDate={target} />
          </FadeIn>
        )}
      </div>
    </section>
  );
}
