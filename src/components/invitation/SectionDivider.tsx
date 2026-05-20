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
