import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { apiFetch } from "@/lib/api";
import { liveQueryOptions } from "@/lib/liveQuery";
import { Users, Shield, Calendar, DollarSign, AlertTriangle, Star, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useTheme } from "@/components/ThemeProvider";
import { Skeleton } from "@/components/ui/skeleton";

type AdminStats = {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  pendingVerifications: number;
  avgRating: number;
  completionRate: number;
  openDisputes: number;
};

type AnalyticsRes = { series: Array<{ month: string; bookings: number; revenue: number }> };

type CategoryStatRow = {
  categoryId: string;
  name: string;
  providerCount: number;
  bookingCount: number;
  avgProviderRating: number;
};

function formatMonthLabel(ym: string): string {
  try {
    return format(parseISO(`${ym}-01`), "MMM yyyy");
  } catch {
    return ym;
  }
}

export default function AdminDashboard() {
  const { resolvedTheme } = useTheme();
  const gridColor = resolvedTheme === "dark" ? "hsl(215, 28%, 17%)" : "hsl(220, 13%, 91%)";
  const textColor = resolvedTheme === "dark" ? "hsl(218, 15%, 55%)" : "hsl(220, 9%, 46%)";
  const tooltipBg = resolvedTheme === "dark" ? "hsl(224, 50%, 8%)" : "hsl(0, 0%, 100%)";

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<AdminStats>("/admin/stats"),
    ...liveQueryOptions,
  });

  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => apiFetch<AnalyticsRes>("/admin/analytics?months=12"),
    ...liveQueryOptions,
  });

  const { data: categoryRows, isLoading: loadingCat } = useQuery({
    queryKey: ["admin-category-stats"],
    queryFn: () => apiFetch<CategoryStatRow[]>("/admin/category-stats"),
    ...liveQueryOptions,
  });

  const chartData =
    analytics?.series.map((p) => ({
      ...p,
      monthLabel: formatMonthLabel(p.month),
    })) ?? [];

  const lastMonthRevenue = chartData.length ? chartData[chartData.length - 1]!.revenue : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Overview" description="SkillSnap marketplace analytics and operations" />

      {loadingStats || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} changeType="neutral" />
            <StatCard title="Providers" value={stats.totalProviders.toLocaleString()} icon={Shield} changeType="neutral" />
            <StatCard title="Active Bookings" value={stats.activeBookings} icon={Calendar} />
            <StatCard
              title="Total revenue (paid)"
              value={`RM ${stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              icon={DollarSign}
              changeType="neutral"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/admin/providers?queue=pending"
              className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <StatCard title="Pending Verifications" value={stats.pendingVerifications} icon={Shield} change="Review queue" changeType="neutral" />
            </Link>
            <StatCard title="Open Disputes" value={stats.openDisputes} icon={AlertTriangle} changeType="neutral" change="Not modeled in DB" />
            <StatCard title="Avg Rating" value={String(stats.avgRating)} icon={Star} />
            <StatCard title="Completion Rate" value={`${stats.completionRate}%`} icon={CheckCircle2} changeType="positive" />
          </div>
        </>
      )}

      {stats && (
        <div className="text-xs text-muted-foreground">
          Last month revenue (from chart series): RM {lastMonthRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Bookings Trend</h3>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No booking data in range</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: textColor }} stroke={gridColor} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} stroke={gridColor} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: `1px solid ${gridColor}`,
                    fontSize: "12px",
                    backgroundColor: tooltipBg,
                    color: textColor,
                  }}
                />
                <Bar dataKey="bookings" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-lg border bg-card shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Trend</h3>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No payment data in range</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: textColor }} stroke={gridColor} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} stroke={gridColor} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: `1px solid ${gridColor}`,
                    fontSize: "12px",
                    backgroundColor: tooltipBg,
                    color: textColor,
                  }}
                  formatter={(value: number) => [`RM ${value.toLocaleString()}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--chart-2))" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Service Categories</h3>
        {loadingCat ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <DataTable
            columns={[
              {
                key: "name",
                label: "Category",
                render: (c: CategoryStatRow) => <span className="font-medium text-foreground">{c.name}</span>,
              },
              {
                key: "providers",
                label: "Providers",
                render: (c) => <span className="text-sm text-muted-foreground">{c.providerCount}</span>,
              },
              {
                key: "bookings",
                label: "Bookings",
                render: (c) => <span className="text-sm">{c.bookingCount.toLocaleString()}</span>,
              },
              {
                key: "avgRating",
                label: "Avg provider rating",
                render: (c) => <span className="text-sm font-medium">{c.avgProviderRating.toFixed(1)}</span>,
              },
            ]}
            data={categoryRows ?? []}
          />
        )}
      </div>
    </div>
  );
}
