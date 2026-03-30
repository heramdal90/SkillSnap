import { BadgeCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  verified: boolean;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function VerificationBadge({ verified, size = "sm", showLabel = false, className }: VerificationBadgeProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  if (verified) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-primary", className)} title="Verified Provider">
        <BadgeCheck className={iconSize} />
        {showLabel && <span className="text-xs font-medium">Verified</span>}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-muted-foreground", className)} title="Not Verified">
      <ShieldAlert className={iconSize} />
      {showLabel && <span className="text-xs font-medium">Unverified</span>}
    </span>
  );
}
