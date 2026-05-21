import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!src) {
      setVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [src, onClose]);

  if (!src) return null;

  const bg = theme === "modern-dark" ? "rgba(0,0,0,0.98)" : "rgba(0,0,0,0.95)";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1.25rem",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "2rem",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
      />
    </div>
  );
}
