import { useState, type FormEvent } from "react";
import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { useTheme } from "@/components/ThemeProvider";
import { useRsvp, useExistingRsvp } from "@/hooks/useRsvp";
import { showToast } from "@/hooks/useToast";
import { inputStyle, labelStyle, submitStyle } from "./formStyles";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];
type Guest = Database["public"]["Tables"]["guests"]["Row"];
type Attendance = Database["public"]["Enums"]["rsvp_attendance"];
type Session = Database["public"]["Enums"]["rsvp_session"];

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export function RsvpSection({ setting, guest }: { setting: Setting; guest: Guest | null }) {
  const { theme } = useTheme();
  const rsvp = useRsvp();
  const existing = useExistingRsvp(guest?.id);
  const [done, setDone] = useState(false);

  const [name, setName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [session, setSession] = useState<Session>("keduanya");
  const [total, setTotal] = useState(1);
  const [message, setMessage] = useState("");

  const closed = !setting.rsvp_open;
  const alreadyDone = done || !!existing.data;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Nama wajib diisi");
      return;
    }
    try {
      await rsvp.mutateAsync({
        guest_id: guest?.id ?? null,
        name: name.trim(),
        phone: phone.trim() || null,
        attendance,
        session,
        total_guests: total,
        message: message.trim() || null,
      });
      setDone(true);
      showToast("Konfirmasi terkirim. Terima kasih! 💕");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Gagal mengirim");
    }
  }

  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
      <FadeIn>
        <SectionDivider />
        <div
          className="uppercase"
          style={{ fontSize: "0.7rem", letterSpacing: "0.4em", color: "var(--color-primary)", opacity: 0.75 }}
        >
          Konfirmasi Kehadiran
        </div>
        <h2 className="heading-font" style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 300, margin: "1rem 0" }}>
          RSVP
        </h2>
        <p style={{ opacity: 0.7, maxWidth: 540, margin: "0 auto" }}>
          Mohon konfirmasi kehadiranmu agar kami dapat mempersiapkan yang terbaik. 💕
        </p>
        {setting.rsvp_deadline && (
          <div style={{ marginTop: "0.75rem", color: "var(--color-primary)", fontSize: "0.85rem" }}>
            Paling lambat: {fmtDate(setting.rsvp_deadline)}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={120}>
        {closed ? (
          <div
            style={{
              background: "var(--color-secondary)",
              padding: "2rem",
              marginTop: "2.5rem",
              textAlign: "center",
            }}
          >
            RSVP sudah ditutup. Terima kasih atas perhatianmu. 🙏
          </div>
        ) : alreadyDone ? (
          <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem" }}>💕</div>
            <p style={{ marginTop: "1rem", opacity: 0.8 }}>
              Kamu sudah melakukan konfirmasi kehadiran. Terima kasih!
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: 540, margin: "2.5rem auto 0", textAlign: "left", display: "grid", gap: "1.25rem" }}
          >
            <div>
              <label style={labelStyle(theme)}>Nama Lengkap *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle(theme)}
              />
            </div>
            <div>
              <label style={labelStyle(theme)}>No. WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle(theme)}
              />
            </div>
            <div>
              <label style={labelStyle(theme)}>Konfirmasi *</label>
              <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                {(["hadir", "tidak_hadir", "mungkin"] as Attendance[]).map((v) => (
                  <label
                    key={v}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value={v}
                      checked={attendance === v}
                      onChange={() => setAttendance(v)}
                      style={{ accentColor: "var(--color-primary)" }}
                    />
                    {v === "hadir" ? "Hadir" : v === "tidak_hadir" ? "Tidak Hadir" : "Mungkin"}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle(theme)}>Hadir di Acara</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value as Session)}
                style={inputStyle(theme)}
              >
                <option value="keduanya">Akad & Resepsi</option>
                <option value="akad">Akad Nikah</option>
                <option value="resepsi">Resepsi</option>
              </select>
            </div>
            <div>
              <label style={labelStyle(theme)}>Jumlah Tamu</label>
              <input
                type="number"
                min={1}
                max={10}
                value={total}
                onChange={(e) => setTotal(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                style={inputStyle(theme)}
              />
            </div>
            <div>
              <label style={labelStyle(theme)}>Pesan / Doa</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesanmu di sini..."
                style={{ ...inputStyle(theme), minHeight: 100, resize: "vertical" }}
              />
            </div>
            <button type="submit" disabled={rsvp.isPending} style={submitStyle(rsvp.isPending)}>
              {rsvp.isPending ? "Mengirim..." : "Kirim Konfirmasi"}
            </button>
          </form>
        )}
      </FadeIn>
    </section>
  );
}
