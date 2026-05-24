import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { getSupabase } from "@/lib/supabaseClient";
import { showToast } from "@/hooks/useToast";
import { uploadToBucket } from "@/lib/storage";
import { fieldStyle, labelStyle, inputCls } from "./_shared";

export function AmplopsTab() {
  const { data: accs = [] } = useBankAccounts();
  const qc = useQueryClient();
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [qris, setQris] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!bank || !number || !holder) return showToast("Lengkapi data");
    setSaving(true);
    const sb = await getSupabase();
    const { error } = await sb.from("bank_accounts").insert({
      bank_name: bank, account_number: number, account_name: holder,
      qris_image: qris, display_order: accs.length,
    });
    setSaving(false);
    if (error) return showToast(error.message);
    setBank(""); setNumber(""); setHolder(""); setQris(null);
    qc.invalidateQueries({ queryKey: ["bank_accounts"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus?")) return;
    const sb = await getSupabase();
    await sb.from("bank_accounts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["bank_accounts"] });
  };

  const onQris = async (f: File) => {
    try { setQris(await uploadToBucket("qris", f)); } catch (e) { showToast((e as Error).message); }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {accs.map((a) => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.875rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{a.bank_name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{a.account_number} · a.n. {a.account_name}</div>
            </div>
            <button onClick={() => remove(a.id)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}>🗑</button>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>+ Tambah Rekening</h3>
      <div style={fieldStyle}><label style={labelStyle}>Nama Bank *</label><input className={inputCls} value={bank} onChange={(e) => setBank(e.target.value)} /></div>
      <div style={fieldStyle}><label style={labelStyle}>Nomor Rekening *</label><input className={inputCls} value={number} onChange={(e) => setNumber(e.target.value)} /></div>
      <div style={fieldStyle}><label style={labelStyle}>Atas Nama *</label><input className={inputCls} value={holder} onChange={(e) => setHolder(e.target.value)} /></div>
      <div style={fieldStyle}>
        <label style={labelStyle}>QRIS (opsional)</label>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onQris(e.target.files[0])} />
        {qris && <img src={qris} alt="" style={{ height: 80, marginTop: 6, borderRadius: 4 }} />}
      </div>
      <button onClick={add} disabled={saving} style={{ background: "#C9A96E", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: 8, cursor: "pointer", marginTop: 8 }}>
        {saving ? "Menyimpan…" : "💾 Tambah Rekening"}
      </button>
    </div>
  );
}
