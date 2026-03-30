import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Admin web console: only `admin` role may access protected routes.
 */
export function RoleGate({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin") {
      logout();
      navigate("/login", {
        replace: true,
        state: { message: "This console is for administrators only." },
      });
    }
  }, [user, logout, navigate]);

  if (!user) {
    return <>{children}</>;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Signing out…
      </div>
    );
  }

  return <>{children}</>;
}
