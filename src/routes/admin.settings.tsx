import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { useWeddingSetting } from "@/hooks/useWeddingSetting";
import { GeneralInfoTab } from "@/components/admin/settings/GeneralInfoTab";
import { EventDetailTab } from "@/components/admin/settings/EventDetailTab";
import { ThemeTab } from "@/components/admin/settings/ThemeTab";
import { GalleryTab } from "@/components/admin/settings/GalleryTab";
import { LoveStoryTab } from "@/components/admin/settings/LoveStoryTab";
import { AmplopsTab } from "@/components/admin/settings/AmplopsTab";
import { MediaSeoTab } from "@/components/admin/settings/MediaSeoTab";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <AdminAuthGuard>
      <AdminLayout activePage="settings">
        <AdminSettingsPage />
      </AdminLayout>
    </AdminAuthGuard>
  ),
});

const TABS = [
  { key: "general", label: "Umum" },
  { key: "event", label: "Acara" },
  { key: "theme", label: "Tema" },
  { key: "gallery", label: "Galeri" },
  { key: "love", label: "Love Story" },
  { key: "amplop", label: "Amplop" },
  { key: "media", label: "Media & SEO" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function AdminSettingsPage() {
  const [active, setActive] = useState<TabKey>("general");
  const { data: setting, isLoading } = useWeddingSetting();

  return (
    <>
      <AdminPageHeader title="Konten & Tema" subtitle="Pengaturan undangan" />

      <div
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          marginBottom: 16,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #C9A96E" : "2px solid transparent",
                color: isActive ? "#1a1a1a" : "#6b7280",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                padding: "0.6rem 1rem",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <AdminCard>
        {isLoading || !setting ? (
          <p style={{ color: "#6b7280" }}>Memuat pengaturan…</p>
        ) : (
          <>
            {active === "general" && <GeneralInfoTab setting={setting} />}
            {active === "event" && <EventDetailTab setting={setting} />}
            {active === "theme" && <ThemeTab setting={setting} />}
            {active === "gallery" && <GalleryTab />}
            {active === "love" && <LoveStoryTab />}
            {active === "amplop" && <AmplopsTab />}
            {active === "media" && <MediaSeoTab setting={setting} />}
          </>
        )}
      </AdminCard>
    </>
  );
}
