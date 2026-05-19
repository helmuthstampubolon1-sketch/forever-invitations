import { createContext, useContext, useEffect, useMemo } from "react";
import { useWeddingSetting } from "@/hooks/useWeddingSetting";

type Theme = "elegant" | "floral" | "modern-dark" | "javanese";

const FONT_MAP: Record<Theme, { heading: string; body: string; href: string }> = {
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
};

type Ctx = {
  setting: ReturnType<typeof useWeddingSetting>["data"];
  theme: Theme;
  themeClass: string;
};

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: setting } = useWeddingSetting();
  const theme = (setting?.theme as Theme) ?? "elegant";
  const themeClass = `theme-${theme}`;

  // Inject Google Font link
  useEffect(() => {
    const href = FONT_MAP[theme].href;
    const id = "theme-google-font";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }, [theme]);

  // Inject CSS vars + theme class
  useEffect(() => {
    if (!setting) return;
    const root = document.documentElement;
    const headingFont = setting.heading_font || FONT_MAP[theme].heading;
    const bodyFont = setting.body_font || FONT_MAP[theme].body;
    const vars: Record<string, string> = {
      "--color-primary": setting.primary_color || "#C9A96E",
      "--color-secondary": setting.secondary_color || "#F5F0E8",
      "--color-accent": setting.accent_color || "#8B6914",
      "--color-text": setting.text_color || "#2C2C2C",
      "--color-bg": setting.background_color || "#FFFFFF",
      "--font-heading": `'${headingFont}', serif`,
      "--font-body": `'${bodyFont}', sans-serif`,
    };
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    ["theme-elegant", "theme-floral", "theme-modern-dark", "theme-javanese"].forEach((c) =>
      root.classList.remove(c),
    );
    root.classList.add(themeClass);
  }, [setting, theme, themeClass]);

  const value = useMemo<Ctx>(() => ({ setting, theme, themeClass }), [setting, theme, themeClass]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
