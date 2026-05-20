import { useEffect, useRef, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { getSupabase } from "@/lib/supabaseClient";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];

export function MusicPlayer({
  setting,
  autoplayTrigger,
}: {
  setting: Setting;
  autoplayTrigger: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!setting.music_file) return;
    const file = setting.music_file;
    if (/^https?:\/\//.test(file)) {
      setSrc(file);
      return;
    }
    (async () => {
      const supabase = await getSupabase();
      const { data } = supabase.storage.from("music").getPublicUrl(file);
      setSrc(data.publicUrl);
    })();
  }, [setting.music_file]);

  useEffect(() => {
    if (!autoplayTrigger || !setting.music_autoplay) return;
    const id = setTimeout(() => {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
    }, 600);
    return () => clearTimeout(id);
  }, [autoplayTrigger, setting.music_autoplay]);

  if (!setting.music_file) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <style>{`
        @keyframes mp-pulse-ring {
          0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-primary) 45%, transparent); }
          70% { box-shadow: 0 0 0 12px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
      `}</style>
      {src && <audio ref={audioRef} src={src} loop />}
      <button
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 999,
          width: 48,
          height: 48,
          borderRadius: "9999px",
          background: "var(--color-primary)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "1.1rem",
          animation: playing ? "mp-pulse-ring 2s infinite" : undefined,
        }}
      >
        {playing ? "🎵" : "🔇"}
      </button>
    </>
  );
}
