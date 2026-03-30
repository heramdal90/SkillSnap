import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { apiFetch } from "@/lib/api";
import { Users, Shield, Calendar, CreditCard, AlertTriangle, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import { liveQueryOptions } from "@/lib/liveQuery";
type UserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type UsersRes = { items: UserRow[]; total: number };

type ProviderRow = {
  id: string;
  businessName: string;
  verificationStatus: string;
  avgRating: number;
  totalJobs: number;
  user: { fullName: string; email: string };
};

type ProviderQueue = "pending" | "verified" | "rejected" | "all";

type ProvidersRes = { items: ProviderRow[]; total: number };

type BookingRow = {
  booking: {
    id: string;
    status: string;
    scheduledAt: string;
    paymentStatus: string;
    finalPrice: number | null;
  };
  serviceRequest: { title: string };
  category: { name: string };
  consumerName: string;
  providerBusinessName: string;
};

type BookingsRes = { items: BookingRow[]; total: number };

type PaymentRow = {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  consumerName: string | null;
  providerBusinessName: string | null;
};

type PaymentsRes = { items: PaymentRow[]; total: number };

type CategoryStatRow = {
  name: string;
  providerCount: number;
  bookingCount: number;
  avgProviderRating: number;
};

export function AdminUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiFetch<UsersRes>("/admin/users?limit=100&offset=0"),
    ...liveQueryOptions,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="User Management" description="Consumers, providers, and admins" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]} />
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description={`${data?.total ?? 0} users`} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]} />
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Name", render: (u: UserRow) => <span className="font-medium">{u.fullName}</span> },
            { key: "email", label: "Email", render: (u) => <span className="text-sm text-muted-foreground">{u.email}</span> },
            { key: "role", label: "Role", render: (u) => <StatusBadge status={u.role} /> },
            { key: "created", label: "Created", render: (u) => <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleString()}</span> },
          ]}
          data={data?.items ?? []}
        />
      )}
    </div>
  );
}

export function AdminProviders() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const queue = (searchParams.get("queue") as ProviderQueue | null) || "pending";
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const listUrl =
    queue === "all"
      ? "/admin/providers?limit=100&offset=0"
      : `/admin/providers?limit=100&offset=0&verificationStatus=${queue}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-providers", queue],
    queryFn: () => apiFetch<ProvidersRes>(listUrl),
    ...liveQueryOptions,
  });

  const verifyMutation = useMutation({
    mutationFn: async ({
      id,
      verificationStatus,
      reason,
    }: {
      id: string;
      verificationStatus: "verified" | "rejected";
      reason?: string;
    }) =>
      apiFetch("/admin/providers/verification", {
        method: "PATCH",
        body: JSON.stringify({
          providerId: id,
          verificationStatus,
          reason: reason || undefined,
        }),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setRejectingId(null);
      setRejectReason("");
      toast.success(
        variables.verificationStatus === "verified" ? "Provider approved" : "Provider rejected",
      );
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Verification update failed");
    },
  });

  const setQueue = (q: ProviderQueue) => {
    setSearchParams(q === "pending" ? {} : { queue: q });
  };

  const queueTabs: { id: ProviderQueue; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "verified", label: "Verified" },
    { id: "rejected", label: "Rejected" },
    { id: "all", label: "All" },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Providers" description="All provider profiles" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Providers" }]} />
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Provider Verification" description={`${data?.total ?? 0} profiles`} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Providers" }]} />

      <div className="flex flex-wrap gap-2">
        {queueTabs.map((t) => (
          <Button
            key={t.id}
            type="button"
            variant={queue === t.id ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setQueue(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          {rejectingId && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3 max-w-lg">
              <p className="text-sm font-medium">Reject provider</p>
              <p className="text-xs text-muted-foreground">Optional message to the provider (shown in their app notification).</p>
              <Input
                placeholder="Reason (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={verifyMutation.isPending}
                  onClick={() =>
                    verifyMutation.mutate({
                      id: rejectingId,
                      verificationStatus: "rejected",
                      reason: rejectReason.trim() || undefined,
                    })
                  }
                >
                  Confirm reject
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setRejectingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <DataTable
            columns={[
              { key: "biz", label: "Business", render: (p: ProviderRow) => <span className="font-medium">{p.businessName}</span> },
              { key: "user", label: "Owner", render: (p) => <span className="text-sm text-muted-foreground">{p.user.fullName}</span> },
              { key: "email", label: "Email", render: (p) => <span className="text-sm">{p.user.email}</span> },
              { key: "ver", label: "Verification", render: (p) => <StatusBadge status={p.verificationStatus} /> },
              { key: "rating", label: "Rating", render: (p) => <span className="text-sm">{p.avgRating.toFixed(1)}</span> },
              {
                key: "actions",
                label: "Actions",
                className: "w-[200px]",
                render: (p: ProviderRow) =>
                  p.verificationStatus === "pending" ? (
                    <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        size="sm"
                        className="h-7 text-xs"
                        disabled={verifyMutation.isPending}
                        onClick={() => verifyMutation.mutate({ id: p.id, verificationStatus: "verified" })}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={verifyMutation.isPending}
                        onClick={() => {
                          setRejectingId(p.id);
                          setRejectReason("");
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  ),
              },
            ]}
            data={data?.items ?? []}
          />
        </>
      )}
    </div>
  );
}

export function AdminBookings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => apiFetch<BookingsRes>("/admin/bookings?limit=100&offset=0"),
    ...liveQueryOptions,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Bookings" description="All marketplace bookings" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Bookings" }]} />
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Booking Supervision" description={`${data?.total ?? 0} bookings`} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Bookings" }]} />
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={[
            {
              key: "svc",
              label: "Service",
              render: (row: BookingRow) => (
                <div>
                  <p className="font-medium text-sm">{row.serviceRequest.title}</p>
                  <p className="text-xs text-muted-foreground">{row.category.name}</p>
                </div>
              ),
            },
            { key: "consumer", label: "Consumer", render: (row) => <span className="text-sm">{row.consumerName}</span> },
            { key: "provider", label: "Provider", render: (row) => <span className="text-sm">{row.providerBusinessName}</span> },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.booking.status} /> },
            {
              key: "when",
              label: "Scheduled",
              render: (row) => <span className="text-xs text-muted-foreground">{new Date(row.booking.scheduledAt).toLocaleString()}</span>,
            },
          ]}
          data={data?.items ?? []}
        />
      )}
    </div>
  );
}

export function AdminPayments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => apiFetch<PaymentsRes>("/admin/payments?limit=100&offset=0"),
    ...liveQueryOptions,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payments" description="Recorded payments" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Payments" }]} />
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Oversight" description={`${data?.total ?? 0} payments`} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Payments" }]} />
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={[
            { key: "id", label: "ID", render: (p: PaymentRow) => <span className="font-mono text-[11px]">{p.id.slice(0, 8)}…</span> },
            { key: "booking", label: "Booking", render: (p) => <span className="font-mono text-xs">{p.bookingId.slice(0, 8)}…</span> },
            { key: "consumer", label: "Consumer", render: (p) => <span className="text-sm">{p.consumerName ?? "—"}</span> },
            { key: "provider", label: "Provider", render: (p) => <span className="text-sm">{p.providerBusinessName ?? "—"}</span> },
            { key: "amt", label: "Amount", render: (p) => <span className="text-sm font-medium">{p.currency} {p.amount.toFixed(2)}</span> },
            { key: "st", label: "Status", render: (p) => <StatusBadge status={p.status} /> },
            { key: "paid", label: "Paid at", render: (p) => <span className="text-xs">{p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}</span> },
          ]}
          data={data?.items ?? []}
        />
      )}
    </div>
  );
}

export function AdminDisputes() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dispute Management" description="Disputes are not stored in the database yet" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Disputes" }]} />
      <EmptyState icon={AlertTriangle} title="No disputes module" description="This area will connect to a disputes collection when added to the backend." />
    </div>
  );
}

export function AdminCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-category-stats"],
    queryFn: () => apiFetch<CategoryStatRow[]>("/admin/category-stats"),
    ...liveQueryOptions,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Categories" description="Service categories" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Categories" }]} />
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Category Management" description="Aggregated usage from MongoDB" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Categories" }]} />
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Category", render: (c: CategoryStatRow) => <span className="font-medium">{c.name}</span> },
            { key: "p", label: "Providers", render: (c) => <span className="text-sm">{c.providerCount}</span> },
            { key: "b", label: "Bookings", render: (c) => <span className="text-sm">{c.bookingCount}</span> },
            { key: "r", label: "Avg rating", render: (c) => <span className="text-sm">{c.avgProviderRating.toFixed(1)}</span> },
          ]}
          data={data ?? []}
        />
      )}
    </div>
  );
}
