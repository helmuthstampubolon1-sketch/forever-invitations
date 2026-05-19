import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useGuestbook() {
  return useQuery({
    queryKey: ["guestbook_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guestbook_messages")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGuestbookSubmit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      guest_id?: string | null;
      name: string;
      location?: string | null;
      message: string;
    }) => {
      const { data, error } = await supabase
        .from("guestbook_messages")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guestbook_messages"] }),
  });
}
