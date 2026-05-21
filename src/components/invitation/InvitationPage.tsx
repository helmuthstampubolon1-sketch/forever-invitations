import { useEffect, useState } from "react";
import { useWeddingSetting } from "@/hooks/useWeddingSetting";
import { useGuest } from "@/hooks/useGuest";
import { useTheme } from "@/components/ThemeProvider";
import { OpeningOverlay } from "./OpeningOverlay";
import { HeroSection } from "./HeroSection";
import { MusicPlayer } from "./MusicPlayer";
import { CoupleSection } from "./CoupleSection";
import { LoveStorySection } from "./LoveStorySection";
import { EventSection } from "./EventSection";
import { useLoveStory } from "@/hooks/useLoveStory";

export function InvitationPage({ slug }: { slug?: string }) {
  const { data: setting, isLoading: settingLoading } = useWeddingSetting();
  const { data: guest, isLoading: guestLoading } = useGuest(slug);
  const { theme } = useTheme();

  const [dismissed, setDismissed] = useState(false);
  const [autoplayTick, setAutoplayTick] = useState(0);

  const loading = settingLoading || (slug && guestLoading);

  useEffect(() => {
    if (!setting) return;
    const title = `${setting.bride_name ?? ""} & ${setting.groom_name ?? ""} | Undangan Pernikahan`;
    document.title = title.trim();
    if (setting.meta_description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", setting.meta_description);
    }
  }, [setting]);

  if (loading || !setting) {
    return (
      <div className="bg-theme min-h-screen flex items-center justify-center">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "9999px",
            border: "3px solid color-mix(in oklab, var(--color-primary) 30%, transparent)",
            borderTopColor: "var(--color-primary)",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const guestData = slug ? guest ?? null : null;

  return (
    <div className="bg-theme text-theme min-h-screen">
      {!dismissed && (
        <OpeningOverlay
          guest={guestData}
          setting={setting}
          theme={theme}
          onOpen={() => {
            setDismissed(true);
            setAutoplayTick((n) => n + 1);
          }}
        />
      )}

      <main style={{ opacity: dismissed ? 1 : 0, transition: "opacity 0.6s ease" }}>
        <HeroSection setting={setting} guest={guestData} />
        <CoupleSection setting={setting} />
        <LoveStorySection items={loveStory ?? []} />
        <EventSection setting={setting} />
      </main>

      <MusicPlayer setting={setting} autoplayTrigger={autoplayTick} />
    </div>
  );
}
