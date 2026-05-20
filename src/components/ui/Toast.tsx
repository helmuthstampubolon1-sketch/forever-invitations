import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";

export function ToastHost() {
  const { toasts } = useToast();
  return (
    <div
      style={{
        position: "fixed",
        bottom: "5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} message={t.message} />
      ))}
    </div>
  );
}

function ToastItem({ message }: { message: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      style={{
        background: "#222",
        color: "#fff",
        padding: "0.75rem 1.5rem",
        borderRadius: "2px",
        fontSize: "0.85rem",
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {message}
    </div>
  );
}
