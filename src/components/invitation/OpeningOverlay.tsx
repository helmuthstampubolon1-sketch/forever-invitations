import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type Guest = Database["public"]["Tables"]["guests"]["Row"];
type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];
type Theme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation" | "bobby";

const BG: Record<Theme, React.CSSProperties> = {
  elegant: {
    background:
      "radial-gradient(circle at center, color-mix(in oklab, var(--color-secondary) 40%, transparent), var(--color-bg))",
  },
  floral: {
    background: "linear-gradient(135deg, #fff5f7, #fff, #f5fff7)",
  },
  "modern-dark": { background: "#0d0d0d" },
  javanese: {
    background:
      "radial-gradient(ellipse at center, #fdf6ec 0%, #f5e6c8 100%)",
  },
  leafitation: {
    background:
      "linear-gradient(160deg, #eef5f1 0%, #fdfaf5 50%, #eef5f1 100%)",
  },
  bobby: {
    background:
      "radial-gradient(ellipse at 20% 30%, rgba(60,85,65,0.55) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(181,129,74,0.25) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(20,28,22,0.9) 0%, transparent 70%), linear-gradient(180deg, #2a332c 0%, #1f2620 100%)",
    color: "#f4ede0",
  },
};

const RADIUS: Record<Theme, string> = {
  elegant: "0",
  floral: "24px",
  "modern-dark": "2px",
  javanese: "0",
  leafitation: "999px",
  bobby: "999px",
};

export function OpeningOverlay({
  guest,
  setting,
  theme,
  onOpen,
}: {
  guest: Guest | null;
  setting: Setting;
  theme: Theme;
  onOpen: () => void;
}) {
  const [leaving, setLeaving] = useState(false);

  const handleOpen = () => {
    setLeaving(true);
    setTimeout(() => onOpen(), 700);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        opacity: leaving ? 0 : 1,
        transform: leaving ? "translateY(-16px)" : "translateY(0)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        color: "var(--color-text)",
        ...BG[theme],
      }}
    >
      <svg
        width="80"
        height="20"
        viewBox="0 0 200 40"
        style={{ color: "var(--color-primary)", opacity: 0.2, marginBottom: "1.5rem" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 20 Q50 0 100 20 T200 20" />
        <circle cx="100" cy="20" r="3" fill="currentColor" stroke="none" />
      </svg>

      <h1
        className="heading-font"
        style={{
          fontSize: "clamp(2rem, 8vw, 4rem)",
          color: "var(--color-primary)",
          fontWeight: 300,
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        {setting.bride_name ?? "Bride"}
        <span
          style={{
            display: "block",
            fontSize: "0.6em",
            opacity: 0.7,
            margin: "0.25rem 0",
          }}
        >
          &amp;
        </span>
        {setting.groom_name ?? "Groom"}
      </h1>

      <p
        className="uppercase"
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.35em",
          opacity: 0.5,
          marginTop: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        Bersama mengundang dengan penuh suka cita
      </p>

      {guest && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.85rem", opacity: 0.55 }}>Kepada Yth.</div>
          <div
            className="heading-font"
            style={{
              fontSize: "1.5rem",
              color: "var(--color-primary)",
              marginTop: "0.25rem",
            }}
          >
            {guest.name}
          </div>
        </div>
      )}

      <button
        onClick={handleOpen}
        className="uppercase cursor-pointer hover:opacity-90 transition-opacity"
        style={{
          background: theme === "bobby" ? "#b5814a" : "var(--color-primary)",
          color: theme === "bobby" ? "#1f2620" : "#fff",
          fontWeight: theme === "bobby" ? 600 : undefined,
          padding: "0.875rem 2.5rem",
          fontSize: "0.8rem",
          letterSpacing: "0.18em",
          border: "none",
          borderRadius: RADIUS[theme],
          marginTop: "2.5rem",
        }}
      >
        💌 Buka Undangan
      </button>
    </div>
  );
}
