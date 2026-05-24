import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { useTheme } from "@/components/ThemeProvider";

type Item = Database["public"]["Tables"]["love_story_items"]["Row"];
type Theme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation";

const ICON: Record<string, string> = {
  heart: "♥",
  ring: "💍",
  home: "🏠",
  star: "★",
};

function formatMonthYear(date: string | null) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(
      new Date(date),
    );
  } catch {
    return "";
  }
}

function useIsMobile(breakpoint = 580) {
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

function Dot({ theme, icon }: { theme: Theme; icon: string }) {
  const style: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: "9999px",
    background: "var(--color-primary)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
    fontSize: "0.95rem",
  };
  if (theme === "floral") {
    style.boxShadow = "0 4px 12px color-mix(in oklab, var(--color-primary) 30%, transparent)";
  } else if (theme === "modern-dark") {
    style.background = "transparent";
    style.border = "2px solid var(--color-primary)";
    style.color = "var(--color-primary)";
  } else if (theme === "javanese") {
    style.borderRadius = "6px";
  } else if (theme === "leafitation") {
    style.boxShadow = "0 4px 16px rgba(74,124,89,0.3)";
    style.border = "2px solid #fff";
  }
  return <div style={style}>{ICON[icon] ?? "♥"}</div>;
}

function TimelineRow({
  item,
  side,
  theme,
}: {
  item: Item;
  side: "left" | "right";
  theme: Theme;
}) {
  const align = side === "left" ? "right" : "left";
  const content = (
    <div style={{ textAlign: align }}>
      <div
        className="uppercase"
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.2em",
          color: "var(--color-primary)",
          opacity: 0.8,
          marginBottom: "0.5rem",
        }}
      >
        {formatMonthYear(item.event_date)}
      </div>
      <div className="heading-font" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
        {item.title}
      </div>
      <div
        style={{
          fontSize: "0.875rem",
          lineHeight: 1.8,
          opacity: theme === "modern-dark" ? 0.85 : 0.7,
          color: theme === "modern-dark" ? "rgba(255,255,255,0.75)" : undefined,
        }}
      >
        {item.content}
      </div>
      {item.photo && (
        <img
          src={item.photo}
          alt=""
          style={{
            maxWidth: 200,
            width: "100%",
            borderRadius: 4,
            marginTop: "0.75rem",
            marginLeft: side === "left" ? "auto" : 0,
          }}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: "2rem",
        alignItems: "start",
        marginBottom: "3rem",
      }}
    >
      {side === "left" ? content : <div />}
      <Dot theme={theme} icon={item.icon} />
      {side === "right" ? content : <div />}
    </div>
  );
}

function MobileRow({ item, theme }: { item: Item; theme: Theme }) {
  const isLeafitation = theme === "leafitation";
  return (
    <div
      style={{
        position: "relative",
        paddingLeft: 60,
        marginBottom: "2.5rem",
        ...(isLeafitation ? {
          background: "#f5fbf7",
          borderRadius: 12,
          padding: "1.25rem 1.25rem 1.25rem 60px",
          borderLeft: "4px solid var(--color-primary)",
        } : {}),
      }}
    >
      <div style={{ position: "absolute", left: isLeafitation ? 12 : 0, top: isLeafitation ? 12 : 0 }}>
        <Dot theme={theme} icon={item.icon} />
      </div>
      <div
        className="uppercase"
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.2em",
          color: "var(--color-primary)",
          opacity: 0.8,
          marginBottom: "0.5rem",
        }}
      >
        {formatMonthYear(item.event_date)}
      </div>
      <div className="heading-font" style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>
        {item.title}
      </div>
      <div style={{ fontSize: "0.875rem", lineHeight: 1.8, opacity: 0.75 }}>{item.content}</div>
      {item.photo && (
        <img
          src={item.photo}
          alt=""
          style={{ maxWidth: 200, width: "100%", borderRadius: 4, marginTop: "0.75rem" }}
        />
      )}
    </div>
  );
}

export function LoveStorySection({ items }: { items: Item[] }) {
  const { theme } = useTheme();
  const isMobile = useIsMobile(580);
  if (!items || items.length === 0) return null;

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 1.5rem" }}>
      <FadeIn>
        <div style={{ textAlign: "center" }}>
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
            Our Story
          </div>
          <h2
            className="heading-font"
            style={{
              fontSize: "clamp(2rem, 6vw, 3rem)",
              fontWeight: 300,
              margin: "1rem 0 3rem",
            }}
          >
            Cerita Kita
          </h2>
        </div>
      </FadeIn>

      <div style={{ position: "relative" }}>
        {!isMobile && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              transform: "translateX(-50%)",
              background:
                "linear-gradient(to bottom, transparent, var(--color-primary), transparent)",
            }}
          />
        )}
        {items.map((item, i) =>
          isMobile ? (
            <FadeIn key={item.id} delay={i * 80}>
              <MobileRow item={item} theme={theme} />
            </FadeIn>
          ) : (
            <FadeIn key={item.id} delay={i * 80}>
              <TimelineRow item={item} side={i % 2 === 0 ? "left" : "right"} theme={theme} />
            </FadeIn>
          ),
        )}
      </div>
    </section>
  );
}
