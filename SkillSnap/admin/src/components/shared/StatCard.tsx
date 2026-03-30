import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, change, changeType = "neutral", subtitle, className }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover group",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-lg bg-primary/8 p-2 group-hover:bg-primary/12 transition-colors shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}
