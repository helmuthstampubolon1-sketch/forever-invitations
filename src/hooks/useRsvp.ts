import { useMutation, useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabaseClient";
import type { Database } from "@/integrations/supabase/types";

type RsvpInsert = Database["public"]["Tables"]["rsvps"]["Insert"];

export function useExistingRsvp(guestId: string | null | undefined) {
  return useQuery({
    enabled: !!guestId,
    queryKey: ["rsvp", guestId],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .eq("guest_id", guestId!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useRsvp() {
  return useMutation({
    mutationFn: async (input: RsvpInsert) => {
      const supabase = await getSupabase();
      const { data, error } = await supabase.from("rsvps").insert(input).select().single();
      if (error) throw error;
      return data;
    },
  });
}
