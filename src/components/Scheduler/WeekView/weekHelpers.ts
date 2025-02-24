// weekHelpers.ts
import {
  differenceInCalendarDays,
  isBefore,
  isAfter,
  startOfDay,
  addDays
} from "date-fns"
import { MultiDayEventPosition, TimedPositionedEvent } from "../interfaces";

export const ALL_DAY_ROW_HEIGHT = 28;
export const HOURS_IN_DAY = 24;
export const HOUR_BLOCK_HEIGHT = 60;
export const TOTAL_DAY_HEIGHT = HOURS_IN_DAY * HOUR_BLOCK_HEIGHT;
export const START_OF_WEEK = 1; // Monday

/**
 * Returns true if an event crosses at least one midnight boundary
 * (i.e., start and end are on different calendar days),
 * or you might explicitly check an `allDay` property here if you have it.
 */
export function isMultiDayEvent(start: Date, end: Date): boolean {
  const startDay = startOfDay(start)
  const endDay = startOfDay(end)
  return startDay.getTime() !== endDay.getTime()
}

/**
 * For a given event and the start of the displayed week,
 * return the `startDayIndex` (0..6) and `endDayIndex` (0..6)
 * specifying which days in the week the event spans.
 *
 * If the event extends before or after the week, we clip it.
 */
export function getEventDaySpan(
  eventStart: Date,
  eventEnd: Date,
  weekStart: Date
) {
  // Clip the event to the week boundaries
  const weekEnd = addDays(weekStart, 7)

  // If event starts before this week, clip to the start of the week
  const clippedStart = isBefore(eventStart, weekStart) ? weekStart : eventStart
  // If event ends after this week, clip to the end of the week minus a millisecond
  // (to keep it within 0..6 day range)
  const clippedEnd = isAfter(eventEnd, weekEnd)
    ? new Date(weekEnd.getTime() - 1)
    : eventEnd

  const startDayIndex = differenceInCalendarDays(startOfDay(clippedStart), weekStart)
  const endDayIndex = differenceInCalendarDays(startOfDay(clippedEnd), weekStart)

  return {
    startDayIndex: Math.max(0, startDayIndex),
    endDayIndex: Math.min(6, endDayIndex)
  }
}

/** For multi-day events, we place them in a top "all-day" area.
 * We'll store them as `MultiDayEventPosition` with day indexes
 * and a `rowIndex` to avoid overlap.
 */

/** Overlap check: two multi-day events overlap in the top row if
 * their day ranges intersect.
 */
function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return !(bStart > aEnd || aStart > bEnd)
}

/**
 * Assign row indexes so overlapping multi-day events get stacked
 * on separate rows.
 */
export function assignMultiDayRows(
  events: Omit<MultiDayEventPosition, "rowIndex">[]
): MultiDayEventPosition[] {
  // Sort by earliest start day first
  const sorted = [...events].sort((a, b) => a.startDayIndex - b.startDayIndex)

  const rows: MultiDayEventPosition[][] = []
  const positioned: MultiDayEventPosition[] = []

  for (const evt of sorted) {
    let placed = false

    // Try to place this event in the first row where it doesn't overlap
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const rowEvents = rows[rowIndex]
      const hasOverlap = rowEvents.some((rowEvt) =>
        rangesOverlap(
          evt.startDayIndex,
          evt.endDayIndex,
          rowEvt.startDayIndex,
          rowEvt.endDayIndex
        )
      )
      if (!hasOverlap) {
        const withRow = { ...evt, rowIndex }
        rowEvents.push(withRow)
        positioned.push(withRow)
        placed = true
        break
      }
    }

    // If we couldn't place it in an existing row, create a new row
    if (!placed) {
      const newRowIndex = rows.length
      const withRow = { ...evt, rowIndex: newRowIndex }
      rows.push([withRow])
      positioned.push(withRow)
    }
  }
  return positioned
}




/**
 * Logic for side-by-side overlap:
 * If two events overlap in time, they must go in different columns.
 */
export function assignSideBySideColumns(
  partials: Omit<TimedPositionedEvent, 'columnIndex'>[]
): TimedPositionedEvent[] {
  // Sort by start time ascending
  const sorted = [...partials].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  const columns: TimedPositionedEvent[][] = [];
  const result: TimedPositionedEvent[] = [];

  for (const evt of sorted) {
    let placed = false;
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      // check overlap with events in that column
      const hasOverlap = columns[colIndex].some((colEvt) => {
        // overlap if colEvt.start < evt.end && colEvt.end > evt.start
        return colEvt.start < evt.end && colEvt.end > evt.start;
      });
      if (!hasOverlap) {
        // place it here
        const withCol = { ...evt, columnIndex: colIndex };
        columns[colIndex].push(withCol);
        result.push(withCol);
        placed = true;
        break;
      }
    }
    if (!placed) {
      // new column
      const newIndex = columns.length;
      const withCol = { ...evt, columnIndex: newIndex };
      columns.push([withCol]);
      result.push(withCol);
    }
  }

  return result;
}