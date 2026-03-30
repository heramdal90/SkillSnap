import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingDisplay({ rating, reviewCount, size = "sm", className }: RatingDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "fill-current",
              star <= Math.round(rating) ? "text-warning" : "text-border",
              size === "sm" && "h-3 w-3",
              size === "md" && "h-3.5 w-3.5",
              size === "lg" && "h-4 w-4"
            )}
          />
        ))}
      </div>
      <span className={cn("font-semibold text-foreground", size === "sm" ? "text-xs" : "text-sm")}>{rating}</span>
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>({reviewCount})</span>
      )}
    </div>
  );
}
