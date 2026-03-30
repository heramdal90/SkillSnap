import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  CreditCard,
  Shield,
  BarChart3,
  FolderOpen,
  AlertTriangle,
  ChevronLeft,
  Zap,
  Menu,
  Search,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

type NavItem = { label: string; href: string; icon: React.ElementType };

const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Providers", href: "/admin/providers", icon: Shield },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
];

function initials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0]!.slice(0, 2).toUpperCase();
  return (p[0]![0]! + p[p.length - 1]![0]!).toUpperCase();
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-60" : "w-0 lg:w-[52px]",
          !sidebarOpen && "overflow-hidden lg:overflow-visible",
        )}
      >
        <div className="flex items-center justify-between h-14 px-3 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-[15px] text-sidebar-foreground tracking-tight truncate">SkillSnap Admin</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hidden lg:flex shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
          </Button>
        </div>

        {sidebarOpen && user && (
          <div className="px-3 py-2.5 border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              Admin console
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <ul className="space-y-0.5">
            {adminNav.map((item) => {
              const active = isActive(item.href);
              const linkContent = (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-all duration-150",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );

              return (
                <li key={item.href}>
                  {!sidebarOpen ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {sidebarOpen && user && (
          <div className="border-t border-sidebar-border p-2.5 space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-warning/10 text-warning">
                {initials(user.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{user.fullName}</p>
                <p className="text-2xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs h-8"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users, providers, bookings…"
                  className="h-8 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {user && (
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ml-1 bg-warning/10 text-warning">
                {initials(user.fullName)}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
