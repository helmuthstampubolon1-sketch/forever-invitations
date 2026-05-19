import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useWeddingSetting() {
  return useQuery({
    queryKey: ["wedding_settings"],
    queryFn: async () => {
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
