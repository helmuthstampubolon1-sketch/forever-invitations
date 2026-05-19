import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabaseClient";

export function useLoveStory() {
  return useQuery({
    queryKey: ["love_story_items"],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("love_story_items")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
