// Lazy supabase accessor — avoids importing client.ts (which touches localStorage)
// during SSR module evaluation. Always call from client-side code paths only.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

let cached: SupabaseClient<Database> | null = null;

export async function getSupabase(): Promise<SupabaseClient<Database>> {
  if (cached) return cached;
  const mod = await import("@/integrations/supabase/client");
  cached = mod.supabase;
  return cached;
}
