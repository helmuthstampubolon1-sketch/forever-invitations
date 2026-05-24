import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { useWeddingSetting } from "@/hooks/useWeddingSetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Page />
      </AdminLayout>
    </AdminAuthGuard>
  ),
});

function Page() {
  const { data: setting, isLoading } = useWeddingSetting();

  return (
    <>
      <AdminPageHeader title="Konten & Tema" subtitle="Pengaturan undangan pernikahan" />
      <AdminCard>
        {isLoading || !setting ? (
          <div style={{ color: "#6b7280" }}>Memuat…</div>
        ) : (
          <Tabs defaultValue="general">
            <TabsList style={{ flexWrap: "wrap", height: "auto" }}>
              <TabsTrigger value="general">Informasi Umum</TabsTrigger>
              <TabsTrigger value="event">Detail Acara</TabsTrigger>
              <TabsTrigger value="theme">Tema & Tampilan</TabsTrigger>
              <TabsTrigger value="gallery">Galeri</TabsTrigger>
              <TabsTrigger value="story">Love Story</TabsTrigger>
              <TabsTrigger value="amplop">Amplop Digital</TabsTrigger>
              <TabsTrigger value="media">Media & SEO</TabsTrigger>
            </TabsList>
            <div style={{ marginTop: 20 }}>
              <TabsContent value="general"><GeneralInfoTab setting={setting} /></TabsContent>
              <TabsContent value="event"><EventDetailTab setting={setting} /></TabsContent>
              <TabsContent value="theme"><ThemeTab setting={setting} /></TabsContent>
              <TabsContent value="gallery"><GalleryTab /></TabsContent>
              <TabsContent value="story"><LoveStoryTab /></TabsContent>
              <TabsContent value="amplop"><AmplopsTab /></TabsContent>
              <TabsContent value="media"><MediaSeoTab setting={setting} /></TabsContent>
            </div>
          </Tabs>
        )}
      </AdminCard>
    </>
  );
}
