import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabaseClient";
import type { Database } from "@/integrations/supabase/types";

type Guest = Database["public"]["Tables"]["guests"]["Row"];

export function useGuest(slug: string | undefined) {
  return useQuery({
    enabled: !!slug,
    queryKey: ["guest", slug],
    queryFn: async (): Promise<Guest | null> => {
      const supabase = await getSupabase();
      // Calls SECURITY DEFINER RPC: returns only safe columns and marks opened_at.
      // Sensitive fields (phone, email, notes) are never exposed publicly.
      const { data, error } = await supabase
        .rpc("get_guest_by_slug", { _slug: slug! })
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      // Pad with nulls so the existing Guest-shaped consumers keep type-checking.
      // PII fields stay null on the client.
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        category: data.category,
        opened_at: data.opened_at,
        is_active: data.is_active,
        phone: null,
        email: null,
        notes: null,
        created_at: "",
        updated_at: "",
      };
    },
  });
}
