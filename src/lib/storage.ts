import { getSupabase } from "./supabaseClient";

export async function uploadToBucket(
  folder: string,
  file: File,
): Promise<string> {
  const supabase = await getSupabase();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("wedding-assets")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("wedding-assets").getPublicUrl(path);
  return data.publicUrl;
}

export async function removeFromBucket(publicUrl: string): Promise<void> {
  const idx = publicUrl.indexOf("/wedding-assets/");
  if (idx === -1) return;
  const path = publicUrl.slice(idx + "/wedding-assets/".length);
  const supabase = await getSupabase();
  await supabase.storage.from("wedding-assets").remove([path]);
}
