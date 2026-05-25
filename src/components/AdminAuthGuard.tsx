import { useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getSupabase } from "@/lib/supabaseClient";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setIsAdmin(null);
      return;
    }
    (async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (!cancelled) setIsAdmin(!error && data === true);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (loading || (session && isAdmin === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" />;
  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center p-6">
        <h1 className="text-xl font-semibold">Akses Ditolak</h1>
        <p className="text-sm text-muted-foreground">
          Akun ini tidak memiliki izin admin.
        </p>
        <Navigate to="/" />
      </div>
    );
  }
  return <>{children}</>;
}
