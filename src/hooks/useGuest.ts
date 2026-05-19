import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useGuest(slug: string | undefined) {
  const query = useQuery({
    enabled: !!slug,
    queryKey: ["guest", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("slug", slug!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!query.data || query.data.opened_at) return;
    supabase
      .from("guests")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", query.data.id)
      .then(() => {});
  }, [query.data]);

  return query;
}
