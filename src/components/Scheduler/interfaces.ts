export interface CalendarEvent {
  _id: string
  description?: string
  location?: string
  start: Date
  end: Date
  color?: string
  resourceId?: string;
  title: string;
  allDay?: boolean;
  attendees?: { email: string, responseStatus?: 'pending' | 'ok' | 'ko' }[];
  new?: boolean;
}
export type EventType = "booking" | "team" | "meeting";

export interface PositionedEvent extends CalendarEvent {
  columnIndex: number;
}
export interface MultiDayEventPosition extends CalendarEvent {
  // The day range within the current week
  startDayIndex: number
  endDayIndex: number
  rowIndex: number // which row in the all-day area
}

/** This local interface for the overlap logic. Adjust if you need more fields. */
export interface TimedPositionedEvent extends CalendarEvent {
  columnIndex: number;
}

/** For spanning bars, we need to know how many columns it covers in the current row. */
export interface SpanningEvent extends CalendarEvent {
  startCol: number;
  endCol: number;
  rowIndex: number;
}
