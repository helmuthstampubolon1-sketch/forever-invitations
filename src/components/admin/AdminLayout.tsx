import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { getSupabase } from "@/lib/supabaseClient";

type NavItem = { to: string; label: string; icon: string; key: string };
type NavSection = { label: string; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    label: "Utama",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: "📊", key: "dashboard" },
      { to: "/admin/guests", label: "Tamu", icon: "👥", key: "guests" },
      { to: "/admin/rsvp", label: "RSVP", icon: "✅", key: "rsvp" },
      { to: "/admin/guestbook", label: "Buku Tamu", icon: "📖", key: "guestbook" },
    ],
  },
  {
    label: "Pengaturan",
    items: [{ to: "/admin/settings", label: "Konten & Tema", icon: "⚙️", key: "settings" }],
  },
];

const GOLD = "#C9A96E";

export function AdminLayout({ children, activePage }: { children: ReactNode; activePage: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const sidebar = (
    <aside
      style={{
        width: 240,
        background: "#1a1a1a",
        padding: "2rem 1.5rem",
        overflowY: "auto",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        transform: open ? "translateX(0)" : undefined,
      }}
      className="admin-sidebar"
    >
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 600, color: GOLD }}>💍 Wedding Admin</div>
        <div
          style={{
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.35)",
            marginTop: "0.25rem",
          }}
        >
          Panel Pengelolaan
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.label}>
          <div
            style={{
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.25)",
              padding: "1.25rem 0.75rem 0.5rem",
            }}
          >
            {section.label}
          </div>
          {section.items.map((item) => {
            const active = item.key === activePage;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: 6,
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  background: active ? GOLD : "transparent",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  marginBottom: 2,
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <div
        style={{
          fontSize: "0.6rem",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.25)",
          padding: "1.25rem 0.75rem 0.5rem",
        }}
      >
        Akun
      </div>
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.6rem 0.75rem",
          borderRadius: 6,
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.875rem",
          textDecoration: "none",
        }}
      >
        <span>🔗</span>
        <span>Preview</span>
      </a>
      <button
        onClick={signOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.6rem 0.75rem",
          borderRadius: 6,
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.875rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <span>🚪</span>
        <span>Keluar</span>
      </button>
    </aside>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); transition: transform 0.2s; }
          .admin-sidebar.open { transform: translateX(0) !important; }
          .admin-main { margin-left: 0 !important; padding: 1.5rem !important; }
          .admin-hamburger { display: block !important; }
        }
      `}</style>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 99,
          }}
        />
      )}
      <div className={open ? "admin-sidebar-wrap open" : "admin-sidebar-wrap"}>
        <div className={open ? "admin-sidebar open" : ""} style={{ display: "contents" }}>
          {sidebar}
        </div>
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="admin-hamburger"
        style={{
          display: "none",
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 101,
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "0.5rem 0.75rem",
          cursor: "pointer",
        }}
      >
        ☰
      </button>
      <main className="admin-main" style={{ marginLeft: 240, padding: "2.5rem", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
