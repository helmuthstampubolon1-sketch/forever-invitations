import { useTheme } from "@/components/ThemeProvider";

export function SectionDivider() {
  const { theme } = useTheme();

  if (theme === "floral") {
    return (
      <div
        className="my-10 text-center text-primary-theme"
        style={{ letterSpacing: "0.3em", fontSize: "1rem", opacity: 0.8 }}
      >
        — 🌸 —
      </div>
    );
  }

  if (theme === "modern-dark") {
    return (
      <div
        className="my-12"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
        }}
      />
    );
  }

  if (theme === "javanese") {
    return (
      <div
        className="my-10 text-center text-primary-theme"
        style={{ letterSpacing: "0.5em", opacity: 0.65 }}
      >
        ⬡ ─── ⬡ ─── ⬡
      </div>
    );
  }

  if (theme === "leafitation") {
    return (
      <div className="my-10 flex items-center justify-center gap-3" style={{ color: "var(--color-primary)", opacity: 0.6 }}>
        <svg viewBox="0 0 24 40" width="14" height="22" fill="currentColor">
          <path d="M12 2 C6 10 5 28 10 36 C11 30 14 18 12 2Z" />
        </svg>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.5em" }}>✦ ✦ ✦</span>
        <svg viewBox="0 0 24 40" width="14" height="22" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
          <path d="M12 2 C6 10 5 28 10 36 C11 30 14 18 12 2Z" />
        </svg>
      </div>
    );
  }

  // elegant default
  return (
    <div
      className="my-10 text-center text-primary-theme"
      style={{ letterSpacing: "1em", fontSize: "0.7rem", opacity: 0.6 }}
    >
      ✦ ✦ ✦
    </div>
  );
}
