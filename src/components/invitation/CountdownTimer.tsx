import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

type TimeLeft = { d: string; h: string; m: string; s: string; done: boolean };

function compute(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (isNaN(diff) || diff <= 0) return { d: "00", h: "00", m: "00", s: "00", done: true };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s), done: false };
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const { theme } = useTheme();
  const [t, setT] = useState<TimeLeft>(() => compute(targetDate));

  useEffect(() => {
    if (t.done) return;
    const id = setInterval(() => {
      const next = compute(targetDate);
      setT(next);
      if (next.done) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate, t.done]);

  if (t.done) {
    return (
      <div
        className="heading-font text-primary-theme text-center mt-10"
        style={{ fontSize: "1.5rem" }}
      >
        🎉 Hari Bahagia Telah Tiba!
      </div>
    );
  }

  const numberStyle: React.CSSProperties = {
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    fontWeight: 300,
    lineHeight: 1,
    color: "var(--color-primary)",
    textShadow:
      theme === "modern-dark" ? "0 0 20px rgba(232,197,110,0.35)" : undefined,
  };
  const separator: React.CSSProperties = {
    fontSize: "2.5rem",
    color: "var(--color-primary)",
    opacity: 0.4,
    fontFamily: "var(--font-heading)",
    alignSelf: "center",
  };

  const units: Array<[string, string]> = [
    [t.d, "Hari"],
    [t.h, "Jam"],
    [t.m, "Menit"],
    [t.s, "Detik"],
  ];

  return (
    <div
      className="flex flex-row justify-center flex-wrap mt-10"
      style={{ gap: "1rem" }}
    >
      {units.map(([val, label], i) => (
        <div key={label} className="contents">
          <div
            className="flex flex-col items-center"
            style={{ minWidth: "70px" }}
          >
            <span className="heading-font" style={numberStyle}>
              {val}
            </span>
            <span
              className="uppercase"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                opacity: 0.55,
                marginTop: "0.25rem",
              }}
            >
              {label}
            </span>
          </div>
          {i < units.length - 1 && <span style={separator}>:</span>}
        </div>
      ))}
    </div>
  );
}
