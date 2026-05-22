import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else navigate({ to: "/admin/dashboard" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <div style={{ maxWidth: 380, width: "100%", margin: "0 auto", padding: "5vh 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem" }}>💍</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "0.5rem" }}>Wedding Admin</h1>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Masuk untuk mengelola undangan</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ fontSize: "0.8rem", color: "#991b1b" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: "#C9A96E", color: "#fff", border: "none",
                padding: "0.7rem", borderRadius: 8, fontSize: "0.9rem", cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
