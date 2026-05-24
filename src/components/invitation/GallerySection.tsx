import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { Lightbox } from "./Lightbox";
import { useTheme } from "@/components/ThemeProvider";

type Photo = Database["public"]["Tables"]["gallery_photos"]["Row"];

export function GallerySection({ photos }: { photos: Photo[] }) {
  const { theme } = useTheme();
  const [openSrc, setOpenSrc] = useState<string | null>(null);

  if (!photos || photos.length === 0) return null;

  const gap =
    theme === "modern-dark" ? 2 : theme === "elegant" ? 4 : theme === "javanese" ? 6 : theme === "leafitation" ? 10 : 8;
  const radius = theme === "floral" ? 8 : theme === "leafitation" ? 10 : 0;
  const filter = theme === "javanese" ? "sepia(15%)" : "none";

  return (
    <section style={{ padding: "5rem 0" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
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
            Momen Bersama
          </div>
          <h2
            className="heading-font"
            style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 300, margin: "1rem 0" }}
          >
            Galeri Foto
          </h2>
        </FadeIn>
      </div>

      <FadeIn delay={120}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: `${gap}px`,
            marginTop: "2rem",
          }}
        >
          {photos.map((p) => (
            <div
              key={p.id}
              onClick={() => setOpenSrc(p.file_path)}
              style={{
                aspectRatio: "1 / 1",
                overflow: "hidden",
                cursor: "pointer",
                borderRadius: radius,
              }}
            >
              <img
                src={p.file_path}
                alt={p.caption ?? ""}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter,
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>
      </FadeIn>

      <Lightbox src={openSrc} onClose={() => setOpenSrc(null)} />
    </section>
  );
}
