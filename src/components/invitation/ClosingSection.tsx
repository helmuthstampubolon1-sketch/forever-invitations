import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { useTheme } from "@/components/ThemeProvider";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];

export function ClosingSection({ setting }: { setting: Setting }) {
  const { theme } = useTheme();

  const ornament =
    theme === "floral" ? (
      <div style={{ fontSize: "1.5rem", marginTop: "2rem" }}>🌸</div>
    ) : theme === "modern-dark" ? (
      <div
        style={{
          width: 60,
          height: 1,
          background: "var(--color-primary)",
          margin: "2rem auto 0",
        }}
      />
    ) : theme === "javanese" ? (
      <div style={{ fontSize: "1.5rem", marginTop: "2rem", color: "var(--color-primary)" }}>⬡</div>
    ) : (
      <div style={{ fontSize: "1.5rem", marginTop: "2rem", color: "var(--color-primary)" }}>✦</div>
    );

  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
      <FadeIn>
        <SectionDivider />
        <h2
          className="heading-font"
          style={{
            fontSize: "clamp(2rem, 8vw, 4.5rem)",
            fontWeight: 300,
            color: "var(--color-primary)",
            margin: "1rem 0",
          }}
        >
          {setting.bride_name} <span style={{ opacity: 0.6 }}>&</span> {setting.groom_name}
        </h2>
        <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", lineHeight: 2.1, opacity: 0.65 }}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami
          <br />
          apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          <br />
          <br />
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </p>
        {ornament}
      </FadeIn>
    </section>
  );
}
