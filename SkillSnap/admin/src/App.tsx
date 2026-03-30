import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { RoleGate } from "@/components/RoleGate";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import { AdminUsers, AdminProviders, AdminBookings, AdminPayments, AdminDisputes, AdminCategories } from "@/pages/admin/AdminPages";

import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { LIVE_POLL_MS } from "@/lib/liveQuery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: Math.min(8_000, LIVE_POLL_MS),
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: "online",
    },
  },
});

function ProtectedShell() {
  return (
    <RequireAuth>
      <RoleGate>
        <AppLayout />
      </RoleGate>
    </RequireAuth>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedShell />}>
                <Route index element={<Navigate to="/admin" replace />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/providers" element={<AdminProviders />} />
                <Route path="admin/bookings" element={<AdminBookings />} />
                <Route path="admin/payments" element={<AdminPayments />} />
                <Route path="admin/disputes" element={<AdminDisputes />} />
                <Route path="admin/categories" element={<AdminCategories />} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
