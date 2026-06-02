import { createContext, useContext, useEffect, useMemo } from "react";
import { useWeddingSetting } from "@/hooks/useWeddingSetting";

type RawTheme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation" | "bobby";
type Theme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation";

const FONT_MAP: Record<RawTheme, { heading: string; body: string; href: string }> = {
  elegant: {
    heading: "Cormorant Garamond",
    body: "Lato",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;700&display=swap",
  },
  floral: {
    heading: "Playfair Display",
    body: "Nunito",
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito:wght@300;400;700&display=swap",
  },
  "modern-dark": {
    heading: "Bebas Neue",
    body: "DM Sans",
    href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;700&display=swap",
  },
  javanese: {
    heading: "Noto Serif",
    body: "Noto Sans",
    href: "https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700&family=Noto+Sans:wght@300;400;700&display=swap",
  },
  leafitation: {
    heading: "Libre Baskerville",
    body: "Inter",
    href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
  },
  bobby: {
    heading: "Cormorant Garamond",
    body: "Lato",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Lato:wght@300;400;700&display=swap",
  },
};

type Ctx = {
  setting: ReturnType<typeof useWeddingSetting>["data"];
  theme: Theme;
  rawTheme: RawTheme;
  themeClass: string;
};

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: setting } = useWeddingSetting();
  const rawTheme = (setting?.theme as RawTheme) ?? "elegant";
  // Bobby reuses leafitation's component-level branches; CSS overrides give it identity.
  const theme: Theme = rawTheme === "bobby" ? "leafitation" : rawTheme;
  const themeClass = `theme-${rawTheme}`;

  useEffect(() => {
    const href = FONT_MAP[rawTheme].href;
    const id = "theme-google-font";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }, [rawTheme]);

  useEffect(() => {
    if (!setting) return;
    const root = document.documentElement;
    const headingFont = setting.heading_font || FONT_MAP[rawTheme].heading;
    const bodyFont = setting.body_font || FONT_MAP[rawTheme].body;

    const defaults: Record<RawTheme, { primary: string; secondary: string; accent: string; text: string; bg: string }> = {
      elegant:     { primary: "#C9A96E", secondary: "#F5F0E8", accent: "#8B6914", text: "#2C2C2C", bg: "#FFFFFF" },
      floral:      { primary: "#E8A0B0", secondary: "#FFF5F7", accent: "#C0607A", text: "#4A3040", bg: "#FFFFFF" },
      "modern-dark": { primary: "#E8C56E", secondary: "#1E1E2E", accent: "#C8A030", text: "#FFFFFF", bg: "#0D0D0D" },
      javanese:    { primary: "#B8732A", secondary: "#FDF6EC", accent: "#7B4F1E", text: "#2C1A0E", bg: "#FEFAF4" },
      leafitation: { primary: "#4A7C59", secondary: "#E8F3EC", accent: "#C9A96E", text: "#2C2C2C", bg: "#FDFAF5" },
      bobby:       { primary: "#d9b886", secondary: "rgba(228, 220, 200, 0.08)", accent: "#b5814a", text: "#f4ede0", bg: "#1f2620" },
    };
    const d = defaults[rawTheme];

    const vars: Record<string, string> = {
      "--color-primary": setting.primary_color || d.primary,
      "--color-secondary": setting.secondary_color || d.secondary,
      "--color-accent": setting.accent_color || d.accent,
      "--color-text": setting.text_color || d.text,
      "--color-bg": setting.background_color || d.bg,
      "--font-heading": `'${headingFont}', serif`,
      "--font-body": `'${bodyFont}', sans-serif`,
    };
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    ["theme-elegant", "theme-floral", "theme-modern-dark", "theme-javanese", "theme-leafitation", "theme-bobby"].forEach((c) =>
      root.classList.remove(c),
    );
    root.classList.add(themeClass);
  }, [setting, rawTheme, themeClass]);

  const value = useMemo<Ctx>(() => ({ setting, theme, rawTheme, themeClass }), [setting, theme, rawTheme, themeClass]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
