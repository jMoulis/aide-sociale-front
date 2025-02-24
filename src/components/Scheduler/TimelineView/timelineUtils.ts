import {
  startOfYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  addDays,
  addMonths,
  addHours,
  format,
  Locale
} from 'date-fns';
import { START_OF_WEEK } from '../WeekView/weekHelpers';
import { TimelineViewScale } from './interfaces';
/**
 * For each partial, see if it overlaps in [startCol..endCol].
 * If so, it goes in a different 'columnIndex' (vertical slot).
 */
export function assignOverlapColumns<T extends { startCol: number; endCol: number }>(
  partials: T[]
): (T & { columnIndex: number })[] {
  const sorted = [...partials].sort((a, b) => a.startCol - b.startCol);
  const columns: (T & { columnIndex: number })[][] = [];
  const result: (T & { columnIndex: number })[] = [];

  for (const evt of sorted) {
    let placed = false;
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const hasOverlap = columns[colIndex].some(
        (e) => !(e.endCol < evt.startCol || e.startCol > evt.endCol)
      );
      if (!hasOverlap) {
        const withIdx = { ...evt, columnIndex: colIndex };
        columns[colIndex].push(withIdx);
        result.push(withIdx);
        placed = true;
        break;
      }
    }
    if (!placed) {
      const newCol = { ...evt, columnIndex: columns.length };
      columns.push([newCol]);
      result.push(newCol);
    }
  }

  return result;
}

/**
 * 'year' => 12 columns (one per month)
 * 'month' => daily columns
 * 'week' => daily columns
 * 'day' => hourly columns
 */

export interface ColumnInfo {
  start: Date;
  end: Date;
  label: string;
}

export function buildColumns(
  date: Date,
  scale: TimelineViewScale,
  locale?: Locale
): ColumnInfo[] {
  switch (scale) {
    case TimelineViewScale.YEAR: {
      // 12 columns => each month
      const cols: ColumnInfo[] = [];
      const yearStart = startOfYear(date);
      for (let i = 0; i < 12; i++) {
        const colStart = addMonths(yearStart, i);
        const colEnd = addMonths(colStart, 1);
        cols.push({
          start: colStart,
          end: colEnd,
          label: format(colStart, 'MMM', { locale }) // 'Jan','Feb'...
        });
      }
      return cols;
    }
    case TimelineViewScale.MONTH: {
      // daily
      const mStart = startOfMonth(date);
      const mEnd = endOfMonth(date);
      const cols: ColumnInfo[] = [];
      let cursor = mStart;
      while (cursor <= mEnd) {
        const next = addDays(cursor, 1);
        cols.push({
          start: cursor,
          end: next,
          label: format(cursor, 'dd', { locale }) // '01','02'
        });
        cursor = next;
      }
      return cols;
    }
    case TimelineViewScale.WEEK: {
      // 7 daily
      const wStart = startOfWeek(date, { weekStartsOn: START_OF_WEEK });
      const wEnd = endOfWeek(date, { weekStartsOn: START_OF_WEEK });
      const cols: ColumnInfo[] = [];
      let cursor = wStart;
      while (cursor <= wEnd) {
        const next = addDays(cursor, 1);
        cols.push({
          start: cursor,
          end: next,
          label: format(cursor, 'EEE dd', { locale })
        });
        cursor = next;
      }
      return cols;
    }
    case TimelineViewScale.DAY: {
      // 24 hours
      const dStart = startOfDay(date);
      const cols: ColumnInfo[] = [];
      for (let h = 0; h < 24; h++) {
        const colStart = addHours(dStart, h);
        const colEnd = addHours(colStart, 1);
        cols.push({
          start: colStart,
          end: colEnd,
          label: format(colStart, 'HH:00', { locale }) // '00:00','01:00'
        });
      }
      return cols;
    }
  }
}
