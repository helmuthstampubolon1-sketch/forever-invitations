import type { CSSProperties } from "react";

type Theme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation";

export function inputStyle(theme: Theme): CSSProperties {
  const base: CSSProperties = {
    width: "100%",
    padding: "0.875rem 1rem",
    background: "transparent",
    fontSize: "0.95rem",
    color: "var(--color-text)",
    outline: "none",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 0,
    fontFamily: "var(--font-body)",
    transition: "border-color 0.2s",
  };
  if (theme === "floral") {
    base.borderRadius = 8;
    base.border = "1px solid rgba(255,182,193,0.5)";
  } else if (theme === "modern-dark") {
    base.background = "rgba(255,255,255,0.05)";
    base.border = "1px solid rgba(255,255,255,0.12)";
    base.color = "#fff";
  } else if (theme === "javanese") {
    base.border = "1px solid color-mix(in oklab, var(--color-primary) 30%, transparent)";
  } else if (theme === "leafitation") {
    base.borderRadius = 10;
    base.border = "1px solid rgba(74,124,89,0.3)";
    base.background = "#f9fcfa";
  }
  return base;
}

export function labelStyle(theme: Theme): CSSProperties {
  return {
    fontSize: "0.68rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    opacity: theme === "modern-dark" ? 1 : 0.65,
    color: theme === "modern-dark" ? "rgba(255,255,255,0.5)" : undefined,
    display: "block",
    marginBottom: "0.5rem",
  };
}

export function submitStyle(disabled: boolean, theme?: Theme): CSSProperties {
  const isLeafitation = theme === "leafitation";
  return {
    background: "var(--color-primary)",
    color: "#fff",
    border: "none",
    fontSize: "0.78rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    width: "100%",
    padding: "1rem",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "opacity 0.2s, transform 0.2s",
    borderRadius: isLeafitation ? "999px" : undefined,
  };
}
