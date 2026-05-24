import { useState, type FormEvent } from "react";
import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { useTheme } from "@/components/ThemeProvider";
import { useGuestbookSubmit } from "@/hooks/useGuestbook";
import { showToast } from "@/hooks/useToast";
import { inputStyle, labelStyle, submitStyle } from "./formStyles";

type Message = Database["public"]["Tables"]["guestbook_messages"]["Row"];
type Guest = Database["public"]["Tables"]["guests"]["Row"];

export function GuestbookSection({
  messages,
  guest,
}: {
  messages: Message[];
  guest: Guest | null;
}) {
  const { theme } = useTheme();
  const submit = useGuestbookSubmit();
  const [list, setList] = useState<Message[]>(messages);
  const [name, setName] = useState(guest?.name ?? "");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");

  // sync when messages prop changes
  if (messages !== list && list === messages) {
    // no-op guard
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      showToast("Nama dan ucapan wajib diisi");
      return;
    }
    try {
      const created = await submit.mutateAsync({
        guest_id: guest?.id ?? null,
        name: name.trim(),
        location: location.trim() || null,
        message: text.trim(),
      });
      setList((prev) => [created as Message, ...prev]);
      setText("");
      setLocation("");
      showToast("Ucapan kamu sudah terkirim. Terima kasih! 🙏");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Gagal mengirim");
    }
  }

  const cardStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderLeft: "3px solid var(--color-primary)",
      background: "var(--color-secondary)",
      padding: "1.25rem",
    };
    if (theme === "floral") {
      base.borderRadius = 12;
      base.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
    } else if (theme === "modern-dark") {
      base.background = "rgba(255,255,255,0.04)";
      base.border = "1px solid rgba(255,255,255,0.08)";
      base.borderLeft = "3px solid var(--color-primary)";
    } else if (theme === "leafitation") {
      base.borderRadius = 12;
      base.background = "#f5fbf7";
      base.borderLeft = "4px solid var(--color-primary)";
      base.boxShadow = "0 4px 12px rgba(74,124,89,0.08)";
    }
    return base;
  };

  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <FadeIn>
          <SectionDivider />
          <div
            className="uppercase"
            style={{ fontSize: "0.7rem", letterSpacing: "0.4em", color: "var(--color-primary)", opacity: 0.75 }}
          >
            Ucapan & Doa
          </div>
          <h2 className="heading-font" style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 300, margin: "1rem 0" }}>
            Buku Tamu
          </h2>
        </FadeIn>
      </div>

      <FadeIn delay={120}>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 540, margin: "2.5rem auto 0", display: "grid", gap: "1.25rem" }}
        >
          <div>
            <label style={labelStyle(theme)}>Nama *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle(theme)}
            />
          </div>
          <div>
            <label style={labelStyle(theme)}>Kota / Asal</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Jakarta, Indonesia"
              style={inputStyle(theme)}
            />
          </div>
          <div>
            <label style={labelStyle(theme)}>Ucapan / Doa *</label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tulis doa dan ucapanmu untuk kami..."
              style={{ ...inputStyle(theme), minHeight: 100, resize: "vertical" }}
            />
          </div>
          <button type="submit" disabled={submit.isPending} style={submitStyle(submit.isPending, theme)}>
            {submit.isPending ? "Mengirim..." : "Kirim Ucapan"}
          </button>
        </form>
      </FadeIn>

      <FadeIn delay={200}>
        <div
          style={{
            marginTop: "2.5rem",
            maxHeight: 500,
            overflowY: "auto",
            display: "grid",
            gap: "1rem",
            paddingRight: "0.5rem",
          }}
          className="gb-scroll"
        >
          {list.map((m) => (
            <div key={m.id} style={cardStyle()}>
              <div className="heading-font" style={{ fontSize: "1.1rem", color: "var(--color-primary)" }}>
                {m.name}
              </div>
              {m.location && (
                <div style={{ fontSize: "0.72rem", opacity: 0.52, marginBottom: "0.5rem" }}>
                  📍 {m.location}
                </div>
              )}
              <div style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>{m.message}</div>
            </div>
          ))}
          {list.length === 0 && (
            <div style={{ textAlign: "center", opacity: 0.5, padding: "2rem" }}>
              Belum ada ucapan. Jadilah yang pertama!
            </div>
          )}
        </div>
        <style>{`
          .gb-scroll::-webkit-scrollbar { width: 3px; }
          .gb-scroll::-webkit-scrollbar-thumb { background: var(--color-primary); }
        `}</style>
      </FadeIn>
    </section>
  );
}
