import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabaseClient";

export function useGuest(slug: string | undefined) {
  return useQuery({
    enabled: !!slug,
    queryKey: ["guest", slug],
    queryFn: async () => {
      const supabase = await getSupabase();
      // Calls SECURITY DEFINER RPC: returns only safe columns and marks opened_at.
      // Sensitive fields (phone, email, notes) are never exposed publicly.
      const { data, error } = await supabase
        .rpc("get_guest_by_slug", { _slug: slug! })
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
