import { Navigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" />;
  return <>{children}</>;
}
