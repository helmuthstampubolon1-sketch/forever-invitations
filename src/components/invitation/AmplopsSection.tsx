import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionDivider } from "./SectionDivider";
import { useTheme } from "@/components/ThemeProvider";
import { showToast } from "@/hooks/useToast";

type Account = Database["public"]["Tables"]["bank_accounts"]["Row"];

function BankCard({ acc }: { acc: Account }) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const cardStyle: React.CSSProperties =
    theme === "floral"
      ? {
          background: "#fff",
          border: "1px solid rgba(255,182,193,0.4)",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }
      : theme === "modern-dark"
        ? {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }
        : theme === "javanese"
          ? { background: "var(--color-secondary)", border: "2px solid var(--color-primary)" }
          : theme === "leafitation"
            ? {
                background: "#f5fbf7",
                border: "1px solid rgba(74,124,89,0.2)",
                borderRadius: 16,
                boxShadow: "0 8px 24px rgba(74,124,89,0.1)",
              }
            : {
                background: "var(--color-secondary)",
                border: "1px solid color-mix(in oklab, var(--color-primary) 18%, transparent)",
              };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(acc.account_number);
      setCopied(true);
      showToast("Nomor rekening disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Gagal menyalin nomor");
    }
  };

  return (
    <div style={{ ...cardStyle, textAlign: "center", padding: "1.5rem" }}>
      <div
        className="heading-font"
        style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.25rem" }}
      >
        {acc.bank_name}
      </div>
      <div style={{ fontSize: "1.1rem", letterSpacing: "0.08em", fontWeight: 500, marginBottom: "0.25rem" }}>
        {acc.account_number}
      </div>
      <div style={{ fontSize: "0.78rem", opacity: 0.6, marginBottom: "1rem" }}>
        a.n. {acc.account_name}
      </div>
      <button
        onClick={handleCopy}
        className="copy-btn"
        style={{
          border: "1px solid var(--color-primary)",
          background: "transparent",
          color: "var(--color-primary)",
          fontSize: "0.72rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "0.5rem 1.25rem",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-primary)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-primary)";
        }}
      >
        {copied ? "✓ Tersalin!" : "Salin Nomor"}
      </button>
      {acc.qris_image && (
        <img
          src={acc.qris_image}
          alt="QRIS"
          style={{
            width: 150,
            height: 150,
            objectFit: "contain",
            margin: "1rem auto 0",
            display: "block",
          }}
        />
      )}
    </div>
  );
}

export function AmplopsSection({ accounts }: { accounts: Account[] }) {
  if (!accounts || accounts.length === 0) return null;

  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
      <FadeIn>
        <SectionDivider />
        <div
          className="uppercase"
          style={{ fontSize: "0.7rem", letterSpacing: "0.4em", color: "var(--color-primary)", opacity: 0.75 }}
        >
          Amplop Digital
        </div>
        <h2 className="heading-font" style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 300, margin: "1rem 0" }}>
          Hadiah & Doa
        </h2>
        <p style={{ opacity: 0.7, maxWidth: 600, margin: "0 auto" }}>
          Kehadiran dan doa restu kalian sudah menjadi hadiah terbaik bagi kami. Namun jika berkenan
          memberikan hadiah, dapat dikirimkan melalui:
        </p>
      </FadeIn>

      <FadeIn delay={120}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {accounts.map((a) => (
            <BankCard key={a.id} acc={a} />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
