import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

export default function Login() {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string }; message?: string })?.from?.pathname;
  const stateMessage = (location.state as { message?: string })?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(stateMessage ?? null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (stateMessage) {
      setError(stateMessage);
    }
  }, [stateMessage]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      navigate(from || "/admin", { replace: true });
    } else {
      setError("This console is for administrators only.");
      logout();
    }
  }, [user, navigate, from, logout]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const u = await login(email, password);
      if (u.role !== "admin") {
        logout();
        setError("This console is for administrators only.");
        return;
      }
      navigate(from || "/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setPending(false);
    }
  };

  const quickAdmin = () => {
    setEmail("admin@skillsnap.my");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-card">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">SkillSnap Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage the marketplace (API + MongoDB)</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="rounded-lg border border-dashed p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Demo (after seed)</p>
          <Button type="button" variant="outline" size="sm" className="text-xs" onClick={quickAdmin}>
            Fill admin credentials
          </Button>
        </div>
      </div>
    </div>
  );
}
