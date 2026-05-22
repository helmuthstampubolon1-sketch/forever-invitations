import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabaseClient";
import { showToast } from "@/hooks/useToast";
import type { Database } from "@/integrations/supabase/types";
import { slugify } from "./AddGuestModal";

type Category = Database["public"]["Enums"]["guest_category"];

export function BulkAddModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("friend");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const names = text.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;
    setSaving(true);
    try {
      const supabase = await getSupabase();
      const rows = names.map((n) => ({ name: n, slug: slugify(n), category }));
      const { error } = await supabase.from("guests").insert(rows);
      if (error) throw error;
      showToast(`${rows.length} tamu berhasil ditambahkan`);
      setText("");
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menambahkan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Tambah Tamu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Kategori</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="family">Family</option>
              <option value="friend">Friend</option>
              <option value="colleague">Colleague</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label>Daftar Nama (satu per baris)</Label>
            <Textarea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Budi Santoso\nSiti Rahma\nAndi Wijaya"}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={saving} style={{ background: "#C9A96E", color: "#fff" }}>
              {saving ? "Menyimpan…" : "Tambahkan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
