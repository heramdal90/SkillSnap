import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  matched: { label: "Matched", className: "bg-info/10 text-info border-info/20" },
  booked: { label: "Booked", className: "bg-primary/10 text-primary border-primary/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  requested: { label: "Requested", className: "bg-warning/10 text-warning border-warning/20" },
  accepted: { label: "Accepted", className: "bg-primary/10 text-primary border-primary/20" },
  on_the_way: { label: "On The Way", className: "bg-info/10 text-info border-info/20" },
  arrived: { label: "Arrived", className: "bg-accent/10 text-accent border-accent/20" },
  in_progress: { label: "In Progress", className: "bg-info/10 text-info border-info/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
  refunded: { label: "Refunded", className: "bg-muted text-muted-foreground border-border" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  processing: { label: "Processing", className: "bg-info/10 text-info border-info/20" },
  low: { label: "Low", className: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-border" },
  verified: { label: "Verified", className: "bg-success/10 text-success border-success/20" },
  unverified: { label: "Unverified", className: "bg-warning/10 text-warning border-warning/20" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4 tracking-wide transition-colors",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
