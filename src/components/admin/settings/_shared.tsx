import { useState, useEffect, type ReactNode } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { showToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";

export function useSettingSaver<T extends object>(initial: T | undefined) {
  const [form, setForm] = useState<T>((initial ?? {}) as T);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async (id: string, patch?: Partial<T>) => {
    setSaving(true);
    try {
      const sb = await getSupabase();
      const { error } = await sb.from("wedding_settings").update((patch ?? form) as never).eq("id", id);
      if (error) throw error;
      showToast("Berhasil disimpan!");
      qc.invalidateQueries({ queryKey: ["wedding_settings"] });
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return { form, setField, save, saving };
}

export function SaveButton({ onClick, saving, children }: { onClick: () => void; saving: boolean; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{
        background: "#C9A96E", color: "#fff", border: "none",
        padding: "0.7rem 1.4rem", borderRadius: 8, fontSize: 14, cursor: "pointer",
        marginTop: 20, opacity: saving ? 0.6 : 1,
      }}
    >
      {saving ? "Menyimpan…" : children}
    </button>
  );
}

export const fieldStyle: React.CSSProperties = { marginBottom: "1rem" };
export const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4, color: "#374151" };
export const inputCls = "w-full border rounded-md px-3 py-2 text-sm";
