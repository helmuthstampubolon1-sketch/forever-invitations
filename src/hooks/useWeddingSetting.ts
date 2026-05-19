import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabaseClient";

export function useWeddingSetting() {
  return useQuery({
    queryKey: ["wedding_settings"],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("wedding_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
