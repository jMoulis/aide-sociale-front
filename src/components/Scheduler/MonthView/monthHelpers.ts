// monthHelpers.ts
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isBefore,
  isAfter,
} from "date-fns"
import { START_OF_WEEK } from "../WeekView/weekHelpers"
import { CalendarEvent, SpanningEvent } from "../interfaces"

/** Represents a single day cell in the month grid. */
export interface DayCell {
  date: Date
  isCurrentMonth: boolean
}

/** Returns an array of weeks. Each week is an array of 7 DayCell objects. */
export function getMonthWeeks(current: Date): DayCell[][] {
  const startMonth = startOfMonth(current)
  const endMonth = endOfMonth(current)

  // Expand to include the partial week at the beginning & end
  const calendarStart = startOfWeek(startMonth, { weekStartsOn: START_OF_WEEK })
  const calendarEnd = endOfWeek(endMonth, { weekStartsOn: START_OF_WEEK })

  const weeks: DayCell[][] = []
  let cursor = calendarStart

  while (cursor <= calendarEnd) {
    const week: DayCell[] = []
    for (let i = 0; i < 7; i++) {
      const day = addDays(cursor, i)
      week.push({
        date: day,
        isCurrentMonth: isSameMonth(day, current)
      })
    }
    weeks.push(week)
    cursor = addDays(cursor, 7)
  }

  return weeks
}

/** True if event intersects [weekStart, weekEnd], meaning
 * it has at least 1 minute overlapping with the week.
 */
export function eventIntersectsWeek(
  evt: CalendarEvent,
  weekStart: Date,
  weekEnd: Date
) {
  return evt.end >= weekStart && evt.start <= weekEnd
}

/** Clip event times to ensure they don't exceed the current week range. */
export function clipEventToWeek(
  evt: CalendarEvent,
  weekStart: Date,
  weekEnd: Date
): CalendarEvent {
  const clippedStart = isBefore(evt.start, weekStart) ? weekStart : evt.start
  const clippedEnd = isAfter(evt.end, weekEnd) ? weekEnd : evt.end
  return {
    ...evt,
    start: clippedStart,
    end: clippedEnd
  }
}


/** Check if two events overlap in terms of columns for this week row. */
function spansOverlap(a: SpanningEvent, b: SpanningEvent) {
  return !(b.startCol > a.endCol || a.startCol > b.endCol)
}

/**
 * Assign each multi-day event a rowIndex so overlapping events
 * are stacked.
 */
export function assignMultiDayRows(
  events: Omit<SpanningEvent, "rowIndex">[]
): SpanningEvent[] {
  // Sort by startCol ascending (earliest column first).
  const sorted = [...events].sort((a, b) => a.startCol - b.startCol)
  const rows: SpanningEvent[][] = []
  const positioned: SpanningEvent[] = []

  for (const evt of sorted) {
    let placed = false
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const rowEvts = rows[rowIndex]
      const hasOverlap = rowEvts.some(e => spansOverlap(e, evt as any))
      if (!hasOverlap) {
        const withRow = { ...evt, rowIndex }
        rowEvts.push(withRow)
        positioned.push(withRow)
        placed = true
        break
      }
    }
    if (!placed) {
      const newRowIndex = rows.length
      const withRow = { ...evt, rowIndex: newRowIndex }
      rows.push([withRow])
      positioned.push(withRow)
    }
  }

  return positioned
}

export function assignRowIndexes<
  T extends { startCol: number; endCol: number; rowIndex: number }
>(events: T[]): T[] {
  const sorted = [...events].sort((a, b) => a.startCol - b.startCol);
  const rows: T[][] = [];
  const result: T[] = [];

  for (const evt of sorted) {
    let placed = false;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const rowEvts = rows[rowIndex];
      // Overlap if they share any day columns
      const overlap = rowEvts.some(
        (re) => !(evt.startCol > re.endCol || evt.endCol < re.startCol)
      );
      if (!overlap) {
        const withRow = { ...evt, rowIndex };
        rowEvts.push(withRow);
        result.push(withRow);
        placed = true;
        break;
      }
    }
    if (!placed) {
      const newRowIndex = rows.length;
      const withRow = { ...evt, rowIndex: newRowIndex };
      rows.push([withRow]);
      result.push(withRow);
    }
  }
  return result;
}