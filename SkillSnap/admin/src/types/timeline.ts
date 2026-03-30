export type TimelineEventType = "info" | "success" | "warning" | "error";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: TimelineEventType;
}
