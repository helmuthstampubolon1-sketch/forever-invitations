import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabaseClient";

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      const supabase = await getSupabase();
      const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
        setLoading(false);
      });
      unsub = () => sub.subscription.unsubscribe();
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    })();
    return () => unsub?.();
  }, []);

  return { session, loading };
}
