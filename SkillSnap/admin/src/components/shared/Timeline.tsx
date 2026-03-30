import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, Clock } from "lucide-react";
import type { TimelineEvent } from "@/types/timeline";

const typeConfig = {
  info: { icon: Info, color: "text-info", bg: "bg-info/10" },
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  warning: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative space-y-0">
      {events.map((event, i) => {
        const config = typeConfig[event.type];
        const Icon = config.icon;
        const isLast = i === events.length - 1;
        return (
          <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
            {!isLast && (
              <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
            )}
            <div className={cn("relative z-10 h-6 w-6 rounded-full flex items-center justify-center shrink-0", config.bg)}>
              <Icon className={cn("h-3 w-3", config.color)} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-medium text-foreground leading-tight">{event.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {new Date(event.timestamp).toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
