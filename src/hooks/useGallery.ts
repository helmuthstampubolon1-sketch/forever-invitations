import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabaseClient";

export function useGallery() {
  return useQuery({
    queryKey: ["gallery_photos"],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
